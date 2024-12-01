// controllers/dailyCalorieController.js
import DailyCalorie from '../models/DailyCalorie.js';

export const addDailyCalories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, totalCalories } = req.body;

    // Validate input
    if (!date || totalCalories == null) {
      return res.status(400).json({ error: 'Date and totalCalories are required' });
    }

    // Check if entry for the date already exists
    let dailyCalorie = await DailyCalorie.findOne({ user: userId, date });
    if (dailyCalorie) {
      // Update existing entry
      dailyCalorie.totalCalories = totalCalories;
      await dailyCalorie.save();
    } else {
      // Create new entry
      dailyCalorie = new DailyCalorie({ user: userId, date, totalCalories });
      await dailyCalorie.save();
    }

    res.status(201).json(dailyCalorie);
  } catch (error) {
    console.error('Failed to save daily calories:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDailyCalories = async (req, res) => {
  try {
    const userId = req.user.id;
    const dailyCalories = await DailyCalorie.find({ user: userId }).sort({ date: -1 });
    res.json(dailyCalories);
  } catch (error) {
    console.error('Failed to fetch daily calories:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
