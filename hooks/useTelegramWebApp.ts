import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const tw = window.Telegram.WebApp;
    setWebApp(tw);
    tw.ready();

    // Отключаем зум
    tw.expand();

    // Отключаем выделение текста
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

  }, []);

  return webApp;
}

