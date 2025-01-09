import { NextResponse } from 'next/server'
import { blockchain, Block } from '@/utils/blockchain'

const activeMiners = new Map<string, number>();
const MINER_TIMEOUT = 30000; // 30 секунд

function cleanupInactiveMiners() {
  const now = Date.now();
  for (const [id, lastSeen] of activeMiners.entries()) {
    if (now - lastSeen > MINER_TIMEOUT) {
      activeMiners.delete(id);
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minerId = searchParams.get('minerId');

  if (minerId) {
    activeMiners.set(minerId, Date.now());
  }

  cleanupInactiveMiners();

  const pendingBlock = blockchain.getPendingBlockInfo();
  const latestBlock = blockchain.getLatestBlock();

  const data = {
    minersOnline: activeMiners.size,
    pendingBlock,
    latestBlock: {
      index: latestBlock.index,
      hash: latestBlock.hash,
      difficulty: latestBlock.difficulty,
      finder: latestBlock.finder,
      participants: latestBlock.participants,
      startTime: latestBlock.startTime,
      endTime: latestBlock.endTime,
      totalShares: latestBlock.participants.reduce((sum, p) => sum + p.shares, 0)
    },
    allBlocks: blockchain.chain.map(block => ({
      index: block.index,
      hash: block.hash,
      difficulty: block.difficulty,
      finder: block.finder,
      participants: block.participants,
      startTime: block.startTime,
      endTime: block.endTime,
      totalShares: block.participants.reduce((sum, p) => sum + p.shares, 0)
    }))
  };

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const minerId = searchParams.get('minerId');
  
  if (!minerId) {
    return NextResponse.json({ error: 'Miner ID is required' }, { status: 400 });
  }

  if (!blockchain.getPendingBlockInfo()) {
    blockchain.addBlock(`Block data ${Date.now()}`);
  }

  blockchain.getPendingBlockInfo().addShare(minerId);
  const blockMined = blockchain.minePendingBlock(minerId);

  if (blockMined) {
    blockchain.distributeRewards();
  }

  return NextResponse.json({ 
    blockMined,
    pendingBlock: blockchain.getPendingBlockInfo(),
    latestBlock: blockchain.getLatestBlock()
  });
}

