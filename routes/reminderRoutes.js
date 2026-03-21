const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const Scheme = require("../models/Scheme");

const verifyToken = require("../middleware/authMiddleware");


// Create a new reminder
router.post("/create",async (req, res) => {
  try {
    const { userId, schemeId, type, reminderDate } = req.body;

    const newReminder = new Reminder({ userId, schemeId, type, reminderDate });
    await newReminder.save();

    res.status(201).json({ message: "Reminder created successfully", reminder: newReminder });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ message: "Error creating reminder" });
  }
});

//  Get all reminders for a user
router.get("/get/:userId",verifyToken, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId })
      .populate("schemeId", "title description authority category state")
      .sort({ reminderDate: 1 });

    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ message: "Error fetching reminders" });
  }
});

//  Delete a reminder
router.delete("/delete/:id",verifyToken, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ message: "Error deleting reminder" });
  }
});

module.exports = router;