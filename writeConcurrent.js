import fetch from "node-fetch";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

// Number of concurrent requests per iteration
const CONCURRENT_REQUESTS = 10; 
// Number of iterations to run
const ITERATIONS = 200;
// Delay between iterations in milliseconds
const DELAY_BETWEEN_ITERATIONS = 1000; 

let latencies = [];

async function createTestNode() {
  const query = `
    mutation {
      createTestNode
    }
  `;

  const start = performance.now();  // Start measuring latency
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const end = performance.now();  // End measuring latency

  const latency = end - start;
  latencies.push(latency);  // Store latency
  
  const data = await response.json();
  
  if (response.ok && data) {
    console.log(`GraphQL Mutation Latency: ${latency.toFixed(2)} ms`);
  } else {
    console.error("Error response:", data.errors);
  }

  return data;
}

async function runConcurrentWrites() {
  for (let i = 1; i <= ITERATIONS; i++) {
    console.log(`Iteration ${i}: Sending ${CONCURRENT_REQUESTS} concurrent createTestNode mutations.`);

    const promises = Array(CONCURRENT_REQUESTS).fill(null).map(() => createTestNode());
    const results = await Promise.all(promises);

    const successful = results.filter(r => !r.errors).length;
    console.log(`Iteration ${i} completed. Successful mutations: ${successful}/${CONCURRENT_REQUESTS}`);

    if (i < ITERATIONS) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_ITERATIONS));
    }
  }

  // Calculate and display latency stats
  calculateLatencyStats();
}

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

runConcurrentWrites().catch(console.error);
