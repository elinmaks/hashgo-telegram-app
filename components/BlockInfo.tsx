import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

interface BlockInfoProps {
  number: string
  difficulty: string
  nonce: number
  hash: string
  participants: number
  online: number
}

export default function BlockInfo({ number, difficulty, nonce, hash, participants, online }: BlockInfoProps) {
  return (
    <Card className="bg-gray-800 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="font-mono text-base">Информация о блоке</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-mono">Блок:</span>
            <span className="font-mono">#{number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Сложность:</span>
            <span className="font-mono">{difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Nonce:</span>
            <motion.span
              key={nonce}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="font-mono"
            >
              {nonce}
            </motion.span>
          </div>
          <div className="space-y-1">
            <span className="font-mono">Хеш:</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={hash}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[10px] break-all bg-gray-900 p-1.5 rounded"
              >
                <div>{hash.slice(0, 32)}</div>
                <div>{hash.slice(32)}</div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Участники:</span>
            <span className="font-mono">{participants}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono">Онлайн:</span>
            <span className="font-mono">{online}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

