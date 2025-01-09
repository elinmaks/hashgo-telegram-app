import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  balance: { type: Number, default: 0 },
  totalMined: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  lastMiningTime: { type: Date },
  isActive: { type: Boolean, default: false }
});

export const User = mongoose.model('User', userSchema); 