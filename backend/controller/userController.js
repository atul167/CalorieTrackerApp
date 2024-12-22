// controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from '@google/generative-ai';
import bcrypt from 'bcryptjs';
// Register a new user
export const register = async (req, res) => {
  try {
    const { email, password, geminiApiKey } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists using lean for faster query
    let user = await User.findOne({ email }).lean();
    if (user) return res.status(400).json({ error: "User already exists" });

    // Create and save new user
    user = new User({ email, password, geminiApiKey });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email using lean for performance
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get authenticated user's data
export const getUserData = async (req, res) => {
  try {
    // Find user by ID and exclude password using lean for performance
    const user = await User.findById(req.user.id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Decrypt Gemini API key
    const decryptedApiKey = user.geminiApiKey
      ? User.getGeminiApiKey(user.geminiApiKey)
      : null;

    res.json({
      email: user.email,
      geminiApiKey: decryptedApiKey,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Server error" });
  }
};



export const tracker = async (req, res) => {
  const { avg, profile } = req.body;
  const user = req.user;
  const apikey = user.geminiApiKey;
  console.log('Average is {avg}')
  try {
    const genAI = apikey ? new GoogleGenerativeAI(apikey) : null;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `I am a ${profile.gender} and my age is ${profile.age} , my height is ${profile.height} cm , my weight is ${profile.weight} kg. I am currently consuming around ${avg} calories diet everyday. Please analyse my stats and tell me if I am doing well according to my stats and what would you recommend. You can also give some good tips for good diet and sleep Keep the response limited to 8-9 lines`;
    console.log(prompt);
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
}

export const calculator = async (req, res) => {
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
}

export const getUser = async(req, res) => {
  try {
    const user = req.user; // `req.user` is set by the auth middleware
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
}

export const updateApiKey = async (req, res) => {
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
}