import jwt from "jsonwebtoken";
import User from "../models/User.js";
const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token)
    return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // This is for verification !

    const user = await User.findById(decoded.id); // Fetch user from the database using the decoded ID
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } 
    req.user = {
      id: user._id,
      email: user.email,
      geminiApiKey: user.getGeminiApiKey(),
    };
    // console.log(req.user);
    next();
  } catch (err) {
    console.error("Token is not valid:", err.message);
    res.status(403).json({ error: "Token is not valid" });
  }
};

export default auth;
