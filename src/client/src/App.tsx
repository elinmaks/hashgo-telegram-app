import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface BlockData {
  id: string;
  difficulty: string;
  reward: number;
  timestamp: string;
}

interface MiningData {
  minersOnline: number;
  currentBlock: BlockData;
  shares: number;
  history: BlockData[];
}

function App() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [miningData, setMiningData] = useState<MiningData | null>(null);
  const [isMining, setIsMining] = useState(false);
  const [lastReward, setLastReward] = useState<number | null>(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    
    const user = tg.initDataUnsafe?.user;
    if (user) {
      setUser(user);
    }

    tg.setHeaderColor('#2AABEE');
    tg.setBackgroundColor('#FFFFFF');

    tg.MainButton.text = "Начать майнинг";
    tg.MainButton.show();
    tg.MainButton.onClick(() => handleMiningToggle());
  }, []);

  const handleMiningToggle = async () => {
    const tg = window.Telegram.WebApp;
    if (!user) return;

    try {
      if (!isMining) {
        await fetch('/api/mining/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: user.id })
        });
        tg.MainButton.text = "Остановить майнинг";
        startMiningProcess();
      } else {
        await fetch('/api/mining/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: user.id })
        });
        tg.MainButton.text = "Начать майнинг";
      }
      setIsMining(!isMining);
    } catch (error) {
      console.error('Error toggling mining:', error);
    }
  };

  const startMiningProcess = useCallback(() => {
    if (!user) return;

    const miningInterval = setInterval(async () => {
      try {
        const shareResponse = await fetch('/api/mining/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: user.id })
        });
        const shareResult = await shareResponse.json();

        if (shareResult.success && shareResult.reward) {
          setLastReward(shareResult.reward);
          // Показываем уведомление о награде
          const tg = window.Telegram.WebApp;
          tg.showPopup({
            title: 'Блок найден! 🎉',
            message: `Вы получили ${shareResult.reward} HashGo`,
            buttons: [{ type: 'ok' }]
          });
        }

        // Обновляем данные майнинга
        const statsResponse = await fetch(`/api/hashgo-data?telegramId=${user.id}`);
        const statsData = await statsResponse.json();
        setMiningData(statsData);
      } catch (error) {
        console.error('Mining error:', error);
      }
    }, 5000);

    return () => clearInterval(miningInterval);
  }, [user]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (isMining && user) {
      cleanup = startMiningProcess();
    }
    return () => cleanup?.();
  }, [isMining, user, startMiningProcess]);

  return (
    <div className="app">
      <header className="header">
        <h1>HashGo Mining</h1>
        {user && (
          <p className="welcome">Майнер: {user.first_name} {user.last_name}</p>
        )}
      </header>
      <main className="main">
        {lastReward && (
          <div className="reward-notification">
            🎉 Последняя награда: {lastReward} HashGo
          </div>
        )}
        {miningData ? (
          <div className="mining-stats">
            <div className="stat-card">
              <h3>Текущий блок</h3>
              <p className="block-id">{miningData.currentBlock.id}</p>
              <p className="difficulty">Сложность: {miningData.currentBlock.difficulty}</p>
              <p className="reward">Награда: {miningData.currentBlock.reward} HashGo</p>
            </div>
            
            <div className="stat-card">
              <h3>Статистика майнинга</h3>
              <p>Майнеров онлайн: {miningData.minersOnline}</p>
              <p>Ваши шары: {miningData.shares}</p>
              <p className="mining-status">
                Статус: {isMining ? '🟢 Майнинг активен' : '🔴 Майнинг остановлен'}
              </p>
            </div>

            <div className="history-card">
              <h3>История блоков</h3>
              <div className="history-list">
                {miningData.history.map((block, index) => (
                  <div key={index} className="history-item">
                    <span>Блок {block.id}</span>
                    <span>{block.reward} HashGo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="start-mining">
            <p>Нажмите кнопку "Начать майнинг", чтобы присоединиться к сети HashGo</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 