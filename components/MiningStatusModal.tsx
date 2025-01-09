import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface MiningStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: {
    active: boolean;
    shares: number;
    hashRate: number;
    earnings: number;
    totalHashes: number;
  };
}

export function MiningStatusModal({ isOpen, onClose, status }: MiningStatusModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg">Статус майнинга</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-mono font-semibold flex items-center">
              Что такое шары (Shares)?
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Шары - это доказательства работы вашего устройства</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <p className="text-sm text-gray-300">
              Шары - это доказательства работы, которые вы отправляете в сеть. 
              Чем больше шаров вы находите, тем выше вероятность получить награду за блок. 
              Каждый шар увеличивает ваш потенциальный доход.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono">Активен:</span>
              <span className={`font-mono ${status.active ? 'text-green-500' : 'text-red-500'}`}>
                {status.active ? 'Да' : 'Нет'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono">Шары:</span>
              <span className="font-mono">{status.shares}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono">Всего хешей:</span>
              <span className="font-mono">{status.totalHashes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono">Скорость:</span>
              <span className="font-mono">
                {status.hashRate > 0 ? `${Math.floor(status.hashRate).toLocaleString()} H/s` : 'Обновляется...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono">Доход:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="font-mono">
                      {status.earnings > 0 ? status.earnings.toFixed(3) : 'Формируется после нахождения блока'}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Доход рассчитывается пропорционально количеству найденных вами шаров относительно общего количества в сети.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

