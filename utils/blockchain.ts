import crypto from 'crypto';

interface Miner {
  id: string;
  reward: number;
  shares: number;
}

export class Block {
  public nonce: number;
  public hash: string;
  public finder: Miner;
  public participants: Miner[];
  public startTime: number;
  public endTime: number;

  constructor(
    public index: number,
    public previousHash: string,
    public timestamp: number,
    public data: any,
    public difficulty: number
  ) {
    this.nonce = 0;
    this.hash = this.calculateHash();
    this.finder = { id: '', reward: 0, shares: 0 };
    this.participants = [];
    this.startTime = Date.now();
    this.endTime = 0;
  }

  calculateHash(): string {
    return crypto
      .createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
      .digest('hex');
  }

  mine(difficulty: number): void {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  addShare(minerId: string): void {
    const participant = this.participants.find(p => p.id === minerId);
    if (participant) {
      participant.shares++;
    } else {
      this.participants.push({ id: minerId, reward: 0, shares: 1 });
    }
  }
}

export class Blockchain {
  public chain: Block[];
  private difficulty: number;
  private pendingBlock: Block | null;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingBlock = null;
  }

  private createGenesisBlock(): Block {
    return new Block(0, '0', Date.now(), 'Genesis Block', 0);
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data: any): void {
    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(previousBlock.index + 1, previousBlock.hash, Date.now(), data, this.difficulty);
    this.pendingBlock = newBlock;
  }

  minePendingBlock(minerId: string): boolean {
    if (!this.pendingBlock) return false;

    const target = Array(this.difficulty + 1).join('0');
    if (this.pendingBlock.hash.substring(0, this.difficulty) === target) {
      this.pendingBlock.endTime = Date.now();
      this.pendingBlock.finder = { id: minerId, reward: this.calculateReward() * 0.7, shares: 0 };
      this.chain.push(this.pendingBlock);
      this.pendingBlock = null;
      return true;
    }

    this.pendingBlock.addShare(minerId);
    this.pendingBlock.nonce++;
    this.pendingBlock.hash = this.pendingBlock.calculateHash();
    return false;
  }

  private calculateReward(): number {
    return 1000; // Фиксированная награда за блок
  }

  distributeRewards(): void {
    const latestBlock = this.getLatestBlock();
    const totalShares = latestBlock.participants.reduce((sum, p) => sum + p.shares, 0);
    const participantReward = (this.calculateReward() * 0.3) / totalShares;
    latestBlock.participants.forEach(participant => {
      participant.reward = participant.shares * participantReward;
    });
  }

  getPendingBlockInfo(): any {
    if (!this.pendingBlock) return null;
    return {
      index: this.pendingBlock.index,
      nonce: this.pendingBlock.nonce,
      hash: this.pendingBlock.hash,
      difficulty: this.difficulty,
      participants: this.pendingBlock.participants.length
    };
  }
}

export const blockchain = new Blockchain();

