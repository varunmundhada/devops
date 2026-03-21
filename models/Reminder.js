const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true },
  type: { type: String, enum: ["email", "calendar"], default: "email" },
  reminderDate: { type: Date, required: true },
  isSent: { type: Boolean, default: false },
});

module.exports = mongoose.model("Reminder", reminderSchema);