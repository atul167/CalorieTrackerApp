// controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
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
