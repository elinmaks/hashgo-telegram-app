import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface BlockInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockInfo: {
    number: string;
    difficulty: string;
    nonce: number;
    hash: string;
    participants: number;
    online: number;
  };
}

export function BlockInfoModal({ isOpen, onClose, blockInfo }: BlockInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg">Информация о блоке</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-mono font-semibold">Что такое блок?</h3>
            <p className="text-sm text-gray-300">
              Блок - это основная единица блокчейна, содержащая информацию о транзакциях. 
              Каждый блок связан с предыдущим через хеш, образуя цепочку блоков.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono">Блок:</span>
              <span className="font-mono">#{blockInfo.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Сложность:</span>
              <span className="font-mono">{blockInfo.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Nonce:</span>
              <span className="font-mono">{blockInfo.nonce}</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono">Хеш:</span>
              <div className="font-mono text-xs break-all bg-gray-900 p-2 rounded">
                <div>{blockInfo.hash.slice(0, 32)}</div>
                <div>{blockInfo.hash.slice(32)}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Участники:</span>
              <span className="font-mono">{blockInfo.participants}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Онлайн:</span>
              <span className="font-mono">{blockInfo.online}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

