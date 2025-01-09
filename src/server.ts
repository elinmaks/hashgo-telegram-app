import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import { miningService } from './services/MiningService.js';
import { User } from './models/User.js';

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3001;
const TELEGRAM_TOKEN = '7743022174:AAEuGiz_FWhrdeJj8EMxMe0aYSTNAQKq94o';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hashgo';

// Подключение к MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Настройка Telegram бота
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Обработка команд бота
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;

  if (user) {
    await User.findOneAndUpdate(
      { telegramId: user.id },
      {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      },
      { upsert: true }
    );
  }

  const webAppUrl = process.env.WEB_APP_URL || 'http://localhost:5173';
  bot.sendMessage(chatId, 'Добро пожаловать в HashGo Mining! 🚀\n\nНачните майнить прямо сейчас:', {
    reply_markup: {
      inline_keyboard: [[
        { text: '🖥 Открыть майнер', web_app: { url: webAppUrl } }
      ]]
    }
  });
});

bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ telegramId: msg.from?.id });

  if (user) {
    bot.sendMessage(chatId, `💰 Ваш баланс: ${user.balance} HashGo\n📊 Всего намайнено: ${user.totalMined} HashGo\n🎯 Шары: ${user.shares}`);
  } else {
    bot.sendMessage(chatId, '❌ Пользователь не найден. Используйте /start для начала работы.');
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.post('/api/mining/start', async (req: Request, res: Response) => {
  const { telegramId } = req.body;
  try {
    await miningService.startMining(telegramId);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to start mining' });
  }
});

app.post('/api/mining/stop', async (req: Request, res: Response) => {
  const { telegramId } = req.body;
  try {
    await miningService.stopMining(telegramId);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to stop mining' });
  }
});

app.post('/api/mining/share', async (req: Request, res: Response) => {
  const { telegramId } = req.body;
  try {
    const result = await miningService.processShare(telegramId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to process share' });
  }
});

app.get('/api/hashgo-data', async (req: Request, res: Response) => {
  const { telegramId } = req.query;
  try {
    const data = await miningService.getMiningStats(Number(telegramId));
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get mining stats' });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

