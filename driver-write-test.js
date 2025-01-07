import { write } from "./neo4j-utils.js";



// Number of concurrent requests per iteration
const CONCURRENT_REQUESTS = 10; 
// Number of iterations to run
const ITERATIONS = 200;
// Delay between iterations in milliseconds
const DELAY_BETWEEN_ITERATIONS = 1000; 

let latencies = [];

// Function to create a test node
async function createTestNode() {
  const query = `
    CREATE (n:TestNode {timestamp: datetime()})
    RETURN n
  `;

  const nowDate = new Date().toISOString();
  const params = {
    id: randomUUID(),
    name: Date.now().toString(24).toUpperCase(),
    createdAt: nowDate,
    updatedAt: nowDate,
  };

  try {
    write(querym,params)
  } catch (error) {
    console.error("Error creating node:", error);
    return false;
  } finally {
    await session.close();
  }
}

// Run concurrent writes
async function runConcurrentWrites() {
  for (let i = 1; i <= ITERATIONS; i++) {
    console.log(`Iteration ${i}: Sending ${CONCURRENT_REQUESTS} concurrent writes.`);

    const promises = Array(CONCURRENT_REQUESTS).fill(null).map(() => createTestNode());
    const results = await Promise.all(promises);
    
    const successful = results.filter(r => r).length;
    console.log(`Iteration ${i} completed. Successful writes: ${successful}/${CONCURRENT_REQUESTS}`);

    if (i < ITERATIONS) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_ITERATIONS));
    }
  }

  calculateLatencyStats();
  await driver.close();
}

// Calculate and display latency stats
function calculateLatencyStats() {
  const total = latencies.reduce((acc, val) => acc + val, 0);
  const avg = total / latencies.length;
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);

  console.log("\n--- Latency Report ---");
  console.log(`Total Mutations: ${latencies.length}`);
  console.log(`Average Latency: ${avg.toFixed(2)} ms`);
  console.log(`Min Latency: ${min.toFixed(2)} ms`);
  console.log(`Max Latency: ${max.toFixed(2)} ms`);
  console.log("----------------------");
}

// Run the script
runConcurrentWrites().catch(console.error);
