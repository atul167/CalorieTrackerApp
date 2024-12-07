// models/UserProfile.js
import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  height: { type: Number }, // could store in cm
  weight: { type: Number }, // could store in kg
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
export default UserProfile;
