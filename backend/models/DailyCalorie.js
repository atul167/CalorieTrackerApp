// models/DailyCalorie.js
import mongoose from 'mongoose';

const DailyCalorieSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, 
  totalCalories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
});

const DailyCalorie = mongoose.model('DailyCalorie', DailyCalorieSchema);
export default DailyCalorie;
