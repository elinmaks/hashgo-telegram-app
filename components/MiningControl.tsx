import { Button } from '@/components/ui/button'
import { Play, Pause } from 'lucide-react'

interface MiningControlProps {
  isMining: boolean
  onToggle: () => void
  disabled: boolean
}

export default function MiningControl({ isMining, onToggle, disabled }: MiningControlProps) {
  return (
    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onToggle} disabled={disabled}>
      {isMining ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
      <span className="font-mono">{isMining ? 'Остановить майнинг' : 'Начать майнинг'}</span>
    </Button>
  )
}

