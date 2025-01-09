export interface BlockData {
  id: string;
  difficulty: string;
  reward: number;
  timestamp: string;
  participation: 'none' | 'participant' | 'finder';
}

export interface ApiResponse {
  minersOnline: number;
  currentBlock: BlockData;
  shares: number;
  history: BlockData[];
  allBlocks: BlockData[];
}

export async function fetchData(minerId: string): Promise<ApiResponse> {
  const response = await fetch(`/api/hashgo-data?minerId=${minerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

