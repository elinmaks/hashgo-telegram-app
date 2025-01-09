import { put, list, del } from '@vercel/blob';

export interface MiningData {
  userId: string;
  blockIndex: number;
  shares: number;
  foundBlocks: number;
  lastActive: number;
}

export async function saveMiningData(data: MiningData): Promise<string> {
  const { url } = await put(
    `mining/${data.userId}.json`,
    JSON.stringify(data),
    { access: 'public' }
  );
  return url;
}

export async function getMiningData(userId: string): Promise<MiningData | null> {
  try {
    const response = await fetch(`mining/${userId}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function getActiveMinersList(): Promise<string[]> {
  const { blobs } = await list({ prefix: 'mining/' });
  return blobs.map(blob => blob.pathname.replace('mining/', '').replace('.json', ''));
}

