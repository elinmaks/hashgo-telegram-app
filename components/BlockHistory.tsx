import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockData } from '@/utils/api'

interface BlockHistoryProps {
  history: BlockData[]
}

export default function BlockHistory({ history }: BlockHistoryProps) {
  return (
    <Card className="bg-gray-800 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="font-mono">История блоков</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((block) => (
            <div key={block.id} className="flex justify-between items-center">
              <span className="font-mono">#{block.id}</span>
              <span className="font-mono">{block.difficulty}</span>
              <span className="font-mono">{block.reward}</span>
              <span className="font-mono text-xs">{new Date(block.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

