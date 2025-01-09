let isRunning = false;
let hashesGenerated = 0;
let startTime = Date.now();
let lastUpdateTime = Date.now();
const UPDATE_INTERVAL = 1000; // Update every second for more responsive UI

function generateHash(nonce: number): string {
  // Simulate SHA-256 hash generation
  const timestamp = Date.now();
  const baseString = `block_1_${timestamp}_${nonce}`;
  let hash = '';
  const characters = '0123456789abcdef';
  
  // Generate a random hash
  for (let i = 0; i < 64; i++) {
    hash += characters[Math.floor(Math.random() * characters.length)];
  }
  
  return hash;
}

function checkDifficulty(hash: string, difficulty: number): boolean {
  const prefix = '0'.repeat(difficulty);
  return hash.startsWith(prefix);
}

self.onmessage = (e: MessageEvent) => {
  if (e.data.type === 'start') {
    isRunning = true;
    startTime = Date.now();
    lastUpdateTime = Date.now();
    let nonce = 0;
    let currentHash = '';
    
    const miningInterval = setInterval(() => {
      if (!isRunning) {
        clearInterval(miningInterval);
        return;
      }

      // Process multiple hashes per interval
      for (let i = 0; i < 1000; i++) {
        currentHash = generateHash(nonce);
        hashesGenerated++;

        // Check for share (easier difficulty)
        if (checkDifficulty(currentHash, 2)) {
          self.postMessage({
            type: 'share',
            nonce,
            hash: currentHash
          });
        }

        // Check for block (full difficulty)
        if (checkDifficulty(currentHash, 4)) {
          self.postMessage({
            type: 'block',
            nonce,
            hash: currentHash
          });
          isRunning = false;
          clearInterval(miningInterval);
          return;
        }

        nonce++;
      }

      // Update status every second
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
        const hashRate = hashesGenerated / ((currentTime - startTime) / 1000);
        self.postMessage({
          type: 'status',
          nonce,
          hash: currentHash,
          hashRate,
          totalHashes: hashesGenerated
        });
        lastUpdateTime = currentTime;
      }
    }, 100); // Run the mining loop every 100ms
  } else if (e.data.type === 'stop') {
    isRunning = false;
  }
};

