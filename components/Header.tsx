import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'

export default function Header() {
  const webApp = useTelegramWebApp();
  const user = webApp?.initDataUnsafe?.user;

  return (
    <header className="flex justify-between items-center w-full p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold font-mono mr-4">Хэшго</h1>
        {user && (
          <span className="text-sm font-mono">
            Привет, {user.first_name}! (ID: {user.id})
          </span>
        )}
      </div>
      <Button variant="destructive" size="sm" onClick={() => webApp?.close()}>
        <LogOut className="mr-2 h-4 w-4" />
        Выйти
      </Button>
    </header>
  )
}

