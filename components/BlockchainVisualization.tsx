import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Block {
  index: number;
  hash: string;
  timestamp: number;
  finder: string;
  reward: number;
}

interface BlockchainVisualizationProps {
  blocks: Block[];
  onBlockSelect: (block: Block) => void;
}

const BlockchainVisualization: React.FC<BlockchainVisualizationProps> = ({ blocks, onBlockSelect }) => {
  const [prevBlocksLength, setPrevBlocksLength] = useState(blocks.length);
  const containerRef = useRef<HTMLDivElement>(null);

  const blockWidth = 120;
  const blockHeight = 60;
  const arrowLength = 40;
  const svgWidth = Math.max(300, blocks.length * (blockWidth + arrowLength));
  const svgHeight = blockHeight + 40;

  useEffect(() => {
    if (blocks.length > prevBlocksLength && containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
    setPrevBlocksLength(blocks.length);
  }, [blocks, prevBlocksLength]);

  if (blocks.length === 0) {
    return (
      <div className="w-full bg-gray-800 p-4 rounded-lg text-center text-gray-400 font-mono">
        Блоки появятся здесь после начала майнинга
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full overflow-x-auto bg-gray-800 p-4 rounded-lg">
      <svg width={svgWidth} height={svgHeight} className="min-w-full">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.g
              key={block.index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <rect
                x={index * (blockWidth + arrowLength)}
                y={20}
                width={blockWidth}
                height={blockHeight}
                rx={5}
                ry={5}
                fill="#4ade80"
                stroke="#4B5563"
                strokeWidth={2}
                onClick={() => onBlockSelect(block)}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={index * (blockWidth + arrowLength) + blockWidth / 2}
                y={45}
                textAnchor="middle"
                fill="black"
                className="font-mono text-xs"
                pointerEvents="none"
              >
                Блок #{block.index}
              </text>
              <text
                x={index * (blockWidth + arrowLength) + blockWidth / 2}
                y={65}
                textAnchor="middle"
                fill="black"
                className="font-mono text-xs"
                pointerEvents="none"
              >
                {block.reward.toFixed(3)}
              </text>
              {index < blocks.length - 1 && (
                <line
                  x1={index * (blockWidth + arrowLength) + blockWidth}
                  y1={blockHeight / 2 + 20}
                  x2={(index + 1) * (blockWidth + arrowLength)}
                  y2={blockHeight / 2 + 20}
                  stroke="#4B5563"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
              )}
            </motion.g>
          ))}
        </AnimatePresence>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default BlockchainVisualization;

