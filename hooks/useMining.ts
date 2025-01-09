import { useState, useEffect, useCallback, useRef } from 'react';
import { saveMiningData, getMiningData, type MiningData } from '@/utils/storage';

interface MiningState {
  isActive: boolean;
  hashRate: number;
  totalHashes: number;
  shares: number;
  currentHash: string;
  nonce: number;
  lastBlock?: {
    index: number;
    hash: string;
    finder: string;
    reward: number;
  };
}

export function useMining(userId: string) {
  const [state, setState] = useState<MiningState>({
    isActive: false,
    hashRate: 0,
    totalHashes: 0,
    shares: 0,
    currentHash: '0'.repeat(64),
    nonce: 0
  });

  const workerRef = useRef<Worker | null>(null);
  const dataRef = useRef<MiningData | null>(null);

  const saveMiningState = useCallback(async () => {
    if (dataRef.current) {
      await saveMiningData({
        ...dataRef.current,
        lastActive: Date.now()
      });
    }
  }, []);

  useEffect(() => {
    // Load initial mining data
    getMiningData(userId).then(data => {
      if (data) {
        dataRef.current = data;
        setState(prev => ({
          ...prev,
          shares: data.shares
        }));
      } else {
        dataRef.current = {
          userId,
          blockIndex: 0,
          shares: 0,
          foundBlocks: 0,
          lastActive: Date.now()
        };
      }
    });

    // Save mining data periodically
    const saveInterval = setInterval(saveMiningState, 30000);
    return () => clearInterval(saveInterval);
  }, [userId, saveMiningState]);

  const startMining = useCallback(() => {
    if (workerRef.current) return;

    workerRef.current = new Worker(
      new URL('../workers/mining.worker.ts', import.meta.url)
    );

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'status') {
        setState(prev => ({
          ...prev,
          hashRate: e.data.hashRate,
          totalHashes: e.data.totalHashes,
          currentHash: e.data.hash,
          nonce: e.data.nonce
        }));
      } else if (e.data.type === 'share') {
        setState(prev => ({
          ...prev,
          shares: e.data.shares
        }));
        if (dataRef.current) {
          dataRef.current.shares = e.data.shares;
          saveMiningState();
        }
      } else if (e.data.type === 'block') {
        // Handle block found
        if (dataRef.current) {
          dataRef.current.foundBlocks++;
          saveMiningState();
        }
      }
    };

    workerRef.current.postMessage({
      type: 'start',
      blockData: {
        index: dataRef.current?.blockIndex || 0,
        previousHash: '0'.repeat(64),
        timestamp: Date.now(),
        data: `Mining block for ${userId}`,
        difficulty: 4
      }
    });

    setState(prev => ({ ...prev, isActive: true }));
  }, [userId, saveMiningState]);

  const stopMining = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' });
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setState(prev => ({ ...prev, isActive: false }));
    saveMiningState();
  }, [saveMiningState]);

  return {
    ...state,
    startMining,
    stopMining
  };
}

