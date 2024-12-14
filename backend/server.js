import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//Routes
import userRoutes from "./routes/userRoutes.js";
import calorieRoutes from "./routes/dailyCalorieRoutes.js";
import profileRoutes from './routes/userProfileRoutes.js';

import cors from "cors";

// Middleware
app.use(cors()); 
app.use(express.json());

// this is the dummy change

//DB connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', profileRoutes); // /api/users/profile and /api/users/profile GET

app.use("/api/users", userRoutes);
app.use("/api/calories", calorieRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
