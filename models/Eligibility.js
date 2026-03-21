const mongoose = require("mongoose");

const eligibilitySchema = new mongoose.Schema({
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true },
  question: { type: String, required: true },
  field: { type: String, required: true }, // which field in user schema to check (ex: "income")
  condition: { 
    type: String, 
    enum: ["<", ">", "==", "<=", ">="], 
    required: true 
  },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

module.exports = mongoose.model("Eligibility", eligibilitySchema);