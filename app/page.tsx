'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'
import UserProfile from '@/components/UserProfile'
import BlockInfo from '@/components/BlockInfo'
import MiningStatus from '@/components/MiningStatus'
import MiningControl from '@/components/MiningControl'
import BlockchainVisualization from '@/components/BlockchainVisualization'
import { BlockInfoModal } from '@/components/BlockInfoModal'
import { MiningStatusModal } from '@/components/MiningStatusModal'
import { Achievements } from '@/components/Achievements'

export default function HashgoApp() {
  const [isMining, setIsMining] = useState(false);
  const [hashRate, setHashRate] = useState(0);
  const [totalHashes, setTotalHashes] = useState(0);
  const [shares, setShares] = useState(0);
  const [currentHash, setCurrentHash] = useState('0'.repeat(64));
  const [nonce, setNonce] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [showBlockInfo, setShowBlockInfo] = useState(false);
  const [showMiningStatus, setShowMiningStatus] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const webApp = useTelegramWebApp();

  // Haptic feedback helper
  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    webApp?.HapticFeedback.impactOccurred(type);
  }, [webApp]);

  useEffect(() => {
    if (isMining && !workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/mining.worker.ts', import.meta.url)
      );

      workerRef.current.onmessage = (e) => {
        const { type, nonce, hash, hashRate, totalHashes } = e.data;
        
        if (type === 'status') {
          setHashRate(Math.floor(hashRate));
          setTotalHashes(totalHashes);
          setCurrentHash(hash);
          setNonce(nonce);
        } else if (type === 'share') {
          setShares(prev => {
            const newShares = prev + 1;
            setEarnings(newShares * 0.01);
            return newShares;
          });
          hapticFeedback('medium');
        } else if (type === 'block') {
          const newBlock = {
            index: blocks.length + 1,
            hash,
            timestamp: Date.now(),
            finder: webApp?.initDataUnsafe?.user?.id || 'anonymous',
            reward: (shares + 1) * 0.01
          };
          setBlocks(prev => [...prev, newBlock]);
          setCurrentHash(hash);
          setNonce(nonce);
          hapticFeedback('heavy');
          webApp?.showPopup({
            title: 'Блок найден!',
            message: `Вы успешно добыли новый блок! Награда: ${(shares + 1) * 0.01} токенов`
          });
        }
      };

      workerRef.current.postMessage({ type: 'start' });
    } else if (!isMining && workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' });
      workerRef.current.terminate();
      workerRef.current = null;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [isMining, shares, blocks, webApp, hapticFeedback]);

  const handleToggleMining = useCallback(() => {
    setIsMining(prev => !prev);
    hapticFeedback();
  }, [hapticFeedback]);

  const handleBlockSelect = useCallback((block: any) => {
    hapticFeedback();
    // Implement block selection logic
  }, [hapticFeedback]);

  useEffect(() => {
    if (webApp) {
      webApp.setHeaderColor('#1F2937');
      webApp.setBackgroundColor('#111827');
      webApp.onEvent('viewportChanged', () => {
        webApp.expand();
      });
    }
  }, [webApp]);

  const blockInfo = {
    number: "1",
    difficulty: "4",
    nonce,
    hash: currentHash,
    participants: 1,
    online: 1
  };

  const miningStatus = {
    active: isMining,
    shares,
    hashRate,
    earnings,
    totalHashes
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <main className="w-full max-w-md p-4 space-y-4">
        <div onClick={() => hapticFeedback()}>
          <UserProfile balance={earnings} energy={4685} />
        </div>
        
        <div onClick={() => {
          hapticFeedback();
          setShowBlockInfo(true);
        }}>
          <BlockInfo
            number="1"
            difficulty="4"
            nonce={nonce}
            hash={currentHash}
            participants={1}
            online={1}
          />
        </div>
        
        <div onClick={() => {
          hapticFeedback();
          setShowMiningStatus(true);
        }}>
          <MiningStatus
            active={isMining}
            shares={shares}
            hashRate={hashRate}
            earnings={earnings}
            totalHashes={totalHashes}
          />
        </div>
        
        <MiningControl
          isMining={isMining}
          onToggle={handleToggleMining}
          disabled={false}
        />
        
        <BlockchainVisualization 
          blocks={blocks}
          onBlockSelect={handleBlockSelect}
        />

        <Achievements shares={shares} />
      </main>

      <BlockInfoModal
        isOpen={showBlockInfo}
        onClose={() => setShowBlockInfo(false)}
        blockInfo={blockInfo}
      />

      <MiningStatusModal
        isOpen={showMiningStatus}
        onClose={() => setShowMiningStatus(false)}
        status={miningStatus}
      />
    </div>
  );
}

