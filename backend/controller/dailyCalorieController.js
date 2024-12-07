// controllers/dailyCalorieController.js
import DailyCalorie from '../models/DailyCalorie.js';
import dayjs from 'dayjs';

export const add_updateDailyCalories = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      additionalCalories = 0,
      additionalProtein = 0,
      additionalCarbs = 0,
      additionalFats = 0,
      additionalFiber = 0,
    } = req.body;

    const today = dayjs().format('YYYY-MM-DD'); // standardized date string

    let record = await DailyCalorie.findOne({ user: userId, date: today });
    if (!record) {
      // If no record exists for today, create a new one with the provided values
      record = new DailyCalorie({
        user: userId,
        date: today,
        totalCalories: additionalCalories,
        protein: additionalProtein,
        carbs: additionalCarbs,
        fats: additionalFats,
        fiber: additionalFiber,
      });
    } else {
      // If record exists, increment the existing values
      record.totalCalories += additionalCalories;
      record.protein += additionalProtein;
      record.carbs += additionalCarbs;
      record.fats += additionalFats;
      record.fiber += additionalFiber;
    }

    await record.save();

    res.json({
      success: true,
      totalCalories: record.totalCalories,
      protein: record.protein,
      carbs: record.carbs,
      fats: record.fats,
      fiber: record.fiber,
    });
  } catch (error) {
    console.error('Error updating daily calories:', error);
    res.status(500).json({ error: 'Failed to update daily calories' });
  }
};

export async function getAllCalorieData(req, res) {
  try {
    const userId = req.user.id;
    const userCaloriedata = await DailyCalorie.find({ user: userId });
    console.log(userCaloriedata);
    // userCaloriedata is now an array of objects, each with totalCalories and macros
    res.json({ userCaloriedata });
  } catch (error) {
    console.error('Error fetching daily calories data', error);
    res.status(500).json({ error: 'Failed to fetch daily calories' });
  }
}
