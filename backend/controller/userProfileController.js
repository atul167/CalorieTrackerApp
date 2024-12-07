// controllers/userProfileController.js
import UserProfile from '../models/UserProfile.js';

export const createOrUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { name, age, gender, height, weight } = req.body;

    // Find existing profile or create a new one
    let profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
      profile = new UserProfile({ user: userId });
    }

    // Update fields if provided
    if (name !== undefined) profile.name = name;
    if (age !== undefined) profile.age = age;
    if (gender !== undefined) profile.gender = gender;
    if (height !== undefined) profile.height = height;
    if (weight !== undefined) profile.weight = weight;

    await profile.save();
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ user: userId });
    if (!profile) return res.json({ profile: null }); // no profile yet
    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
