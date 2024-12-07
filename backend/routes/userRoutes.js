import express from "express";
const router = express.Router();
import { GoogleGenerativeAI } from '@google/generative-ai';
import { register, login } from "../controller/userController.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

router.post("/getanswer", auth.apply, async(req, res)=> {
  const { avg } = req.body;
  try {
    const genAI = apikey ? new GoogleGenerativeAI(apikey) : null;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Pls tell how much is this calorie high or low for human `;
    // console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    res.json({
      text,
    });
  } catch (error) {
    console.error("Error calling generative AI API:", error);
    res.status(500).json({ error: "Failed to calculate food stats" });
  }
})

router.post("/calculate-food-stats",auth,async (req, res) => {
  const { name, amount } = req.body;
  const user = req.user; 
  const apikey = user.geminiApiKey;
  try {
    const genAI = apikey ? new GoogleGenerativeAI(apikey) : null;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are given a food name which can be liquid or solid food, the amount which can be in gm, per plate is given by 
    user as ${name} and the amount of food as ${amount}. Please generate the stats of total calorie for the user along with the statistics for protein, carbs , fats and fiber.
     I just want an estimate dont go into too much complexity a rough estimate based on cup plate gm whatever is given.
     Finally most important instructions give info in form of single line like this: calories: <calories>, protein: <protein>, carbs: <carbs>, fats: <fats>, fiber: <fiber> Dont write anything before or after this just give me this single line as output.`;
    // console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    res.json({
      text,
    });
  } catch (error) {
    console.error("Error calling generative AI API:", error);
    res.status(500).json({ error: "Failed to calculate food stats" });
  }
});
router.get("/get-user", auth, (req, res) => {
  try {
    const user = req.user; // `req.user` is set by the auth middleware
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

router.post('/update-api-key', auth, async (req, res) => {
  try {
    const { geminiApiKey } = req.body;

    if (!geminiApiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Update the user's API key in the database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.geminiApiKey = geminiApiKey;
    await user.save();

    res.json({ success: true, message: 'API key updated successfully' });
  } catch (error) {
    console.error('Error updating API key:', error.message);
    res.status(500).json({ error: 'Server error while updating API key' });
  }
});

router.post("/register", register);
router.post("/login", login);

export default router;
