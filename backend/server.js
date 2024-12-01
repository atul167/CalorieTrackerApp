import express from "express";
const app = express();
const PORT = 3000;
import cors from "cors";

// Middleware
app.use(cors()); 
app.use(express.json());


import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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

//Routes
import userRoutes from "./routes/userRoutes.js";
import calorieRoutes from "./routes/dailyCalorieRoutes.js";

app.use("/api/users", userRoutes);
app.use("/api/calories", calorieRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
