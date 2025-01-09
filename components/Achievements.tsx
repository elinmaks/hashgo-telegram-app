import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

interface AchievementsProps {
  shares: number;
}

export function Achievements({ shares }: AchievementsProps) {
  const achievements = [
    { name: 'Новичок', requirement: 10, icon: '🔰' },
    { name: 'Про', requirement: 100, icon: '🏅' },
    { name: 'Гуру блокчейна', requirement: 1000, icon: '🏆' },
  ];

  return (
    <Card className="bg-gray-800 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="font-mono text-base flex items-center">
          <Trophy className="mr-2 h-4 w-4" />
          Достижения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {achievements.map((achievement) => (
            <div key={achievement.name} className="flex justify-between items-center">
              <span className="font-mono">{achievement.icon} {achievement.name}</span>
              <span className={`font-mono ${shares >= achievement.requirement ? 'text-green-500' : 'text-gray-500'}`}>
                {shares >= achievement.requirement ? 'Получено' : `${shares}/${achievement.requirement}`}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

