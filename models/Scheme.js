const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["student", "farmer", "startup", "business", "welfare", "women", "other"], 
    required: true 
  },
  authority: { 
    type: String, 
    enum: ["central", "state", "private"], 
    required: true 
  },
  state: { type: String, default: "All" }, // "All" for national schemes
  description: { type: String },
  eligibilityCriteria: {
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 100 },
    occupation: [{ type: String }], // e.g. ["student", "farmer"]
    incomeLimit: { type: mongoose.Schema.Types.Mixed },
    gender: [{ type: String }], // optional
    caste: [ 'general', 'obc', 'sc', 'st' ]// optional
  },
  deadline: { type: Date },
  applyLink: { type: String },
  addedBy: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Scheme", schemeSchema);