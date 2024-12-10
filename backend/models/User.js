// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  geminiApiKey: { type: String },
});

// Explicitly define indexes
UserSchema.index({ email: 1 }, { unique: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Encrypt API key before saving
UserSchema.pre('save', function (next) {
  if (!this.isModified('geminiApiKey') || !this.geminiApiKey) return next();
  try {
    this.geminiApiKey = CryptoJS.AES.encrypt(this.geminiApiKey, process.env.JWT_SECRET).toString();
    next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Decrypt Gemini API key
UserSchema.methods.getGeminiApiKey = function () {
  if (this.geminiApiKey) {
    const bytes = CryptoJS.AES.decrypt(this.geminiApiKey, process.env.JWT_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return null;
};

const User = mongoose.model('User', UserSchema);
export default User;
