const express = require("express");
const mongoose=require("mongoose");
const User=require("../models/user");
const Scheme = require("../models/Scheme"); 

const router = express.Router();

router.get("/eligible/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const schemes = await Scheme.find();

    const eligibleSchemes = schemes.filter((scheme) => {
      const c = scheme.eligibilityCriteria || {};

      // 1️⃣ Age check
      const ageOK =
        (!c.minAge || user.age >= c.minAge) &&
        (!c.maxAge || user.age <= c.maxAge);

      // 2️⃣ Gender check
      const genderOK =
        !c.gender || c.gender.includes(user.gender.toLowerCase());

      // 3️⃣ Caste check (normalize both)
      const casteOK =
        !c.caste || c.caste.map(c => c.toLowerCase()).includes(user.caste.toLowerCase());

      // 4️⃣ Income check
      const incomeOK =
        !c.incomeLimit || user.income <= c.incomeLimit;

      // 5️⃣ Occupation check
      const occupationOK =
        !c.occupation || c.occupation.includes(user.occupation.toLowerCase());

      // 6️⃣ State check
      const stateOK =
        scheme.state === "All" || scheme.state.toLowerCase() === user.state.toLowerCase();

      return ageOK && genderOK && casteOK && incomeOK && occupationOK && stateOK;
    });

    // ✅ Optional: store eligible schemes in user
    user.eligibleSchemes = eligibleSchemes.map((s) => s._id);
    await user.save();

    res.status(200).json({
      count: eligibleSchemes.length,
      schemes: eligibleSchemes,
    });
  } catch (err) {
    console.error("Error checking eligibility:", err);
    res.status(500).json({ message: "Error checking eligibility", error: err });
  }
});

module.exports = router;