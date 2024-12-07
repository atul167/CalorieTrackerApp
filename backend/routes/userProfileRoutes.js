// routes/userProfileRoutes.js
import express from 'express';
import { createOrUpdateUserProfile, getUserProfile } from '../controller/userProfileController.js';
import auth from '../middleware/auth.js'; // ensures req.user is set

const router = express.Router();

router.post('/profile', auth, createOrUpdateUserProfile);
router.get('/profile', auth, getUserProfile);

export default router;
