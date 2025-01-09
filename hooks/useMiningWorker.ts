import { useEffect, useRef, useState } from 'react';

interface MiningStatus {
  nonce: number;
  hash: string;
  hashRate: number;
  totalHashes: number;
}

export function useMiningWorker(difficulty: number, blockData: any) {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<MiningStatus>({
    nonce: 0,
    hash: '',
    hashRate: 0,
    totalHashes: 0
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/mining.worker.ts', import.meta.url));

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'status') {
        setStatus({
          nonce: e.data.nonce,
          hash: e.data.hash,
          hashRate: e.data.hashRate,
          totalHashes: e.data.totalHashes
        });
      } else if (e.data.type === 'found') {
        setIsRunning(false);
        // Handle found block
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const startMining = () => {
    if (workerRef.current) {
      setIsRunning(true);
      workerRef.current.postMessage({
        type: 'start',
        difficulty,
        blockData
      });
    }
  };

  const stopMining = () => {
    if (workerRef.current) {
      setIsRunning(false);
      workerRef.current.postMessage({ type: 'stop' });
    }
  };

  return {
    status,
    isRunning,
    startMining,
    stopMining
  };
}

