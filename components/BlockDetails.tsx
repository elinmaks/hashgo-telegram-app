import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface BlockDetailsProps {
  block: any | null;
  onClose: () => void;
}

const BlockDetails: React.FC<BlockDetailsProps> = ({ block, onClose }) => {
  if (!block) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-mono">Детали блока</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-2">
          <p><span className="font-semibold font-mono">Блок #:</span> {block.index}</p>
          <p>
            <span className="font-semibold font-mono">Хеш:</span>
            <br />
            <span className="font-mono text-xs break-all">
              {block.hash.slice(0, 32)}
              <br />
              {block.hash.slice(32)}
            </span>
          </p>
          <p><span className="font-semibold font-mono">Сложность:</span> {block.difficulty}</p>
          <p><span className="font-semibold font-mono">Нашел:</span> {block.finder.id}</p>
          <p><span className="font-semibold font-mono">Награда нашедшего:</span> {block.finder.reward.toFixed(2)}</p>
          <p><span className="font-semibold font-mono">Участники:</span> {block.participants.length}</p>
          <p><span className="font-semibold font-mono">Награда участника:</span> {block.participants[0]?.reward.toFixed(2) || 0}</p>
          <p><span className="font-semibold font-mono">Всего шаров:</span> {block.totalShares}</p>
          <p><span className="font-semibold font-mono">Время начала:</span> {new Date(block.startTime).toLocaleString()}</p>
          <p><span className="font-semibold font-mono">Время окончания:</span> {new Date(block.endTime).toLocaleString()}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlockDetails;

