import CryptoJS from 'crypto-js';
import { User } from '../models/User.js';
import { Block } from '../models/Block.js';

class MiningService {
  private static instance: MiningService;
  private currentDifficulty: number = 180;
  private baseReward: number = 1000;
  private difficultyAdjustmentBlocks: number = 10;

  private constructor() {}

  public static getInstance(): MiningService {
    if (!MiningService.instance) {
      MiningService.instance = new MiningService();
    }
    return MiningService.instance;
  }

  public async startMining(telegramId: number): Promise<void> {
    const user = await User.findOneAndUpdate(
      { telegramId },
      { isActive: true, lastMiningTime: new Date() },
      { new: true, upsert: true }
    );

    if (!user) throw new Error('User not found');
  }

  public async stopMining(telegramId: number): Promise<void> {
    await User.findOneAndUpdate(
      { telegramId },
      { isActive: false }
    );
  }

  public async processShare(telegramId: number): Promise<{ success: boolean; reward?: number }> {
    const user = await User.findOne({ telegramId });
    if (!user || !user.isActive) return { success: false };

    // Проверяем, прошло ли достаточно времени с последнего шара (минимум 5 секунд)
    const now = new Date();
    if (user.lastMiningTime && now.getTime() - user.lastMiningTime.getTime() < 5000) {
      return { success: false };
    }

    // Генерируем случайное число для определения успешности шара
    const random = Math.random();
    const shareSuccess = random < (1 / this.currentDifficulty);

    if (shareSuccess) {
      const reward = this.calculateReward();
      await User.findOneAndUpdate(
        { telegramId },
        {
          $inc: { shares: 1, balance: reward, totalMined: reward },
          lastMiningTime: now
        }
      );

      // Создаем новый блок
      const block = new Block({
        blockId: `${Math.floor(this.currentDifficulty)}.${Math.floor(Math.random() * 9)}K`,
        difficulty: `${this.currentDifficulty}K`,
        reward,
        minedBy: telegramId,
        hash: this.generateHash(),
        status: 'completed'
      });
      await block.save();

      // Корректируем сложность
      await this.adjustDifficulty();

      return { success: true, reward };
    }

    await User.findOneAndUpdate(
      { telegramId },
      { lastMiningTime: now }
    );

    return { success: false };
  }

  private async adjustDifficulty(): Promise<void> {
    const recentBlocks = await Block.find()
      .sort({ timestamp: -1 })
      .limit(this.difficultyAdjustmentBlocks);

    if (recentBlocks.length >= this.difficultyAdjustmentBlocks) {
      const timeSpan = recentBlocks[0].timestamp.getTime() - recentBlocks[recentBlocks.length - 1].timestamp.getTime();
      const averageBlockTime = timeSpan / recentBlocks.length;

      // Целевое время блока - 30 секунд
      if (averageBlockTime < 30000) {
        this.currentDifficulty *= 1.1; // Увеличиваем сложность на 10%
      } else if (averageBlockTime > 30000) {
        this.currentDifficulty *= 0.9; // Уменьшаем сложность на 10%
      }

      // Ограничиваем сложность
      this.currentDifficulty = Math.max(100, Math.min(500, this.currentDifficulty));
    }
  }

  private calculateReward(): number {
    return Math.floor(this.baseReward * (1 + Math.random() * 0.2 - 0.1)); // ±10% от базовой награды
  }

  private generateHash(): string {
    const randomData = Math.random().toString() + Date.now().toString();
    return CryptoJS.SHA256(randomData).toString();
  }

  public async getMiningStats(telegramId: number) {
    const user = await User.findOne({ telegramId });
    const activeMiners = await User.countDocuments({ isActive: true });
    const recentBlocks = await Block.find()
      .sort({ timestamp: -1 })
      .limit(5);
    
    const currentBlock = {
      id: `${Math.floor(this.currentDifficulty)}.${Math.floor(Math.random() * 9)}K`,
      difficulty: `${this.currentDifficulty.toFixed(1)}K`,
      reward: this.calculateReward(),
      timestamp: new Date().toISOString()
    };

    return {
      minersOnline: activeMiners,
      currentBlock,
      shares: user?.shares || 0,
      history: recentBlocks.map(block => ({
        id: block.blockId,
        difficulty: block.difficulty,
        reward: block.reward,
        timestamp: block.timestamp.toISOString()
      }))
    };
  }
}

export const miningService = MiningService.getInstance(); 