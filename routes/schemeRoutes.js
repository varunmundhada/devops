const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// Get all schemes
router.get("/get", async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: "Server error while fetching schemes" });
  }
});

// Combined filter: authority + category + state
router.get("/authoritycategory", async (req, res) => {
  try {
    const { authority, state, category } = req.query;
    const query = {};

    if (authority) query.authority = authority;
    if (state && state !== "All") query.state = state;
    if (category) query.category = category;

    const schemes = await Scheme.find(query);
    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: "Server error while fetching schemes" });
  }
});

// Get all schemes based on authority & (optional) state
router.get("/authority", async (req, res) => {
  try {
    const { authority, state } = req.query;
    const query = { authority };

    if (state && state !== "All") query.state = state;

    const schemes = await Scheme.find(query);
    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: "Server error while fetching schemes" });
  }
});

// Get all schemes based on category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const schemes = await Scheme.find({ category });

    if (!schemes || schemes.length === 0) {
      return res.status(404).json({ message: "No schemes found for this category" });
    }

    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching schemes by category:", error);
    res.status(500).json({ message: "Server error while fetching schemes" });
  }
});

router.get("/caste/:caste",async(req,res)=>{
  try{
    const caste = req.params.caste.toLowerCase();
    const schemes = await Scheme.find({caste});

    if(!schemes || schemes.length === 0){ 
      return res.status(404).json({message:"No schemes found for this caste"});
    }
    res.status(200).json(schemes);
  }
  catch(error){
    console.error("Error fetching schemes by category:", error);
    res.status(500).json({ message: "Server error while fetching schemes" });
  }
});

module.exports = router;

