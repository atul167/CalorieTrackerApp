// routes/dailyCalorieRoutes.js
import express from 'express';
const router = express.Router();

import auth from '../middleware/auth.js';
import {add_updateDailyCalories,getAllCalorieData} from '../controller/dailyCalorieController.js';

router.post('/update', auth, add_updateDailyCalories);
router.get('/getData', auth, getAllCalorieData);

export default router;