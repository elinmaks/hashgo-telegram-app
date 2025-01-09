import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  blockId: { type: String, required: true },
  difficulty: { type: String, required: true },
  reward: { type: Number, required: true },
  minedBy: { type: Number, ref: 'User' }, // telegramId пользователя
  hash: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['mining', 'completed'], default: 'mining' }
});

export const Block = mongoose.model('Block', blockSchema); 