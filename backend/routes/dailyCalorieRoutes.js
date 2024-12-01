// routes/dailyCalorieRoutes.js
import express from 'express';
const router = express.Router();

import auth from '../middleware/auth.js';
import { addDailyCalories, getDailyCalories } from '../controller/dailyCalorieController.js';

router.post('/', auth, addDailyCalories);
router.get('/', auth, getDailyCalories);

export default router;
