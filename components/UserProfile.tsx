import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'
import Image from 'next/image'

interface UserProfileProps {
  balance: number
  energy: number
}

export default function UserProfile({ balance, energy }: UserProfileProps) {
  const webApp = useTelegramWebApp();
  const user = webApp?.initDataUnsafe?.user;

  return (
    <Card className="bg-gray-800 text-white border-gray-700">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {user && (
          <img
            src={webApp?.initDataUnsafe?.user?.photo_url || '/placeholder-avatar.png'}
            alt={`${user.first_name}'s avatar`}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <CardTitle className="font-mono">Мой профиль</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold font-mono">Баланс:</span>
            <span className="font-mono">{balance.toFixed(3)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold font-mono">Энергия:</span>
              <span className="font-mono">{energy}</span>
            </div>
            <Progress value={(energy / 5000) * 100} className="bg-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

