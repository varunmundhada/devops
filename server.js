const dotenv = require("dotenv");
// Load env variables before anything else
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set in environment variables");
  process.exit(1);
}



const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const schemeRoutes = require("./routes/schemeRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");



// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", authRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/eligibility", eligibilityRoutes);

app.get("/", (req, res) => res.send("Server running 🚀"));



// const express = require('express');
// const router = express.Router();
const Scheme = require('./models/Scheme'); // Import your Scheme model

// Helper function to format schemes for the prompt
const formatSchemesForContext = (schemes) => {
  return schemes.map(scheme => `
    Name: ${scheme.name}
    Category: ${scheme.category}
    Authority: ${scheme.authority}
    Description: ${scheme.description}
    Eligibility: ${scheme.eligibility}
  `).join('\n');
};

// Initialize conversation context
const getInitialContext = () => `
You are SchemeConnect's AI assistant. Your role is to help users find and understand government schemes in India.
Provide concise, accurate information about schemes based on the database provided.
If asked about schemes not in the database, politely inform that you can only provide information about schemes in our system.
Always be helpful and professional.
`;

app.post('/chat', async (req, res) => {
  const { prompt, message } = req.body || {};
  const userText = typeof prompt === 'string' && prompt.trim() 
    ? prompt.trim() 
    : (typeof message === 'string' ? message.trim() : '');

  if (!userText) {
    return res.status(400).json({ 
      error: "Invalid request", 
      message: "'prompt' (or 'message') is required" 
    });
  }

  try {
    // Fetch relevant schemes based on user query
    const schemes = await Scheme.find({
      $or: [
        { name: { $regex: userText, $options: 'i' } },
        { category: { $regex: userText, $options: 'i' } },
        { description: { $regex: userText, $options: 'i' } },
        { eligibility: { $regex: userText, $options: 'i' } }
      ]
    });

    // Prepare context with scheme information
    const schemesContext = formatSchemesForContext(schemes);
    
    // Construct the full prompt with context
    const fullPrompt = `
      ${getInitialContext()}
      
      Available Schemes Information:
      ${schemesContext}
      
      User Question: ${userText}
      
      Please provide a helpful response based on the above scheme information.
    `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: fullPrompt }]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]) {
      const cleanedText = data.candidates[0].content.parts[0].text
        .trim()
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\t/g, '    ');

      res.json({ 
        response: cleanedText,
        relevantSchemes: schemes.map(s => ({
          id: s._id,
          name: s.name,
          category: s.category,
          authority: s.authority
        }))
      });
    } else {
      throw new Error('Unexpected response structure');
    }

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
});

// module.exports = router;





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
require("./utils/sendEmail.js");