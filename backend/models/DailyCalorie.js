// models/DailyCalorie.js
import mongoose from 'mongoose';

const DailyCalorieSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, 
  totalCalories: { type: Number, required: true },
});

const DailyCalorie = mongoose.model('DailyCalorie', DailyCalorieSchema);
export default DailyCalorie;
