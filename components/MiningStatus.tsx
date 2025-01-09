import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

interface MiningStatusProps {
  active: boolean
  shares: number
  hashRate: number
  earnings: number
  totalHashes: number
}

export default function MiningStatus({ active, shares, hashRate, earnings, totalHashes }: MiningStatusProps) {
  const [hashRateHistory, setHashRateHistory] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const now = new Date();
    const time = `${now.getMinutes()}:${now.getSeconds().toString().padStart(2, '0')}`;
    setHashRateHistory(prev => [...prev.slice(-10), { time, value: hashRate }]);
  }, [hashRate]);

  return (
    <Card className="bg-gray-800 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="font-mono text-base">Статус майнинга</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-mono">Активен:</span>
            <span className={`font-mono ${active ? 'text-green-500' : 'text-red-500'}`}>
              {active ? 'Да' : 'Нет'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Шары:</span>
            <motion.span
              key={shares}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-mono"
            >
              {shares}
            </motion.span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Всего хешей:</span>
            <span className="font-mono">{totalHashes.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Скорость:</span>
            <motion.span
              key={hashRate}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="font-mono"
            >
              {hashRate > 0 ? `${Math.floor(hashRate).toLocaleString()} H/s` : 'Обновляется...'}
            </motion.span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Доход:</span>
            <span className="font-mono">
              {earnings > 0 ? earnings.toFixed(3) : 'Формируется после нахождения блока'}
            </span>
          </div>
        </div>
        <div className="mt-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hashRateHistory}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

