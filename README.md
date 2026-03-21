#problem statement description
Millions of eligible students and citizens miss out on scholarships and government subsidies every year due to scattered information across multiple portals, complex eligibility criteria, and lack of awareness. According to studies, over 60% of students are unaware of available schemes, and thousands of crores in funds remain unutilized annually.

The current ecosystem is fragmented  portals are difficult to navigate, eligibility rules are confusing, and applicants face repeated document submissions. This leads to frustration, application dropouts, and financial stress on families.

There is a clear need for a unified platform the aggregates all scholarship and subsidy schemes, analyzes user profiles to match eligibility, and provides step-by-step guidance making access to opportunities simpler, faster, and more transparent.



## Tech Stack

 Layer  Technology Used 
 **Frontend**  React.js (with multilingual support using JSON translations) 
 **Backend**  Node.js, Express.js 
 **Database**  MongoDB (Mongoose) 
 **Authentication**  JWT, bcrypt.js 
 **Tools**  Axios, jsPDF, Google Calendar API 



## ⚙️ Backend Setup

### 1️⃣ Installation

# Clone the repo
git clone <repo-link>

# Navigate to backend
cd backend

# Install dependencies
npm install

#Check with this credintials
email : priya@example.com
password : 123456

#Features worthy to check
multi-lingual(only available 2 languages for now(telugu, hindi))
chatbot
eligibity check only after login
filters 
remainders directly to the gmail(if correct) with date and time 

#Future addons
will be authenticated using digilocker
will be using apis

#Use this .env for further checking
MONGO_URI=mongodb+srv://scheme_connect:dhanush12032006@schemeconnect.n5aej7q.mongodb.net/?appName=schemeconnect
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=komatireddydhanushreddy@gmail.com
EMAIL_PASS=qolcbtivicsidzoz
EMAIL_FROM=komatireddydhanushreddy@gmail.comf
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=AIzaSyDs0Kyt8iX2eVRRNQywl847etuimnN4RB0


=>routes for login and register
    >api/users/login -- for login
    >api/users/register -- for register

=>routes for schemes
    >/api/schemes/get --get all schemes
    >/api/schemes//authority --get schemes based on authority
    >/api/schemes/category/:category --get schemes based on category
    >/api/schemes/authoritycategory --get schemes based on authority,category and state

=>routes for reminders
    >/api/reminders/create --create new reminder
    >/api/reminders/get/:userid --get all reminders of user
    >/api/reminders/delete/:reminderid --delete a reminder
     
