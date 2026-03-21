const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  occupation: { 
    type: String, 
    enum: ["student", "farmer", "entrepreneur", "employee", "other"], 
    required: true 
  },
  password: { type: String, required: true },
  income: { type: Number },
  state: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["male", "female", "other"] },
  caste: { type: String, enum: ["general", "obc", "sc", "st"] },
  eligibleSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scheme" }],
  createdAt: { type: Date, default: Date.now },
});

// ✅ Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // generate salt
    this.password = await bcrypt.hash(this.password, salt); // hash password
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Method to compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("user", userSchema);