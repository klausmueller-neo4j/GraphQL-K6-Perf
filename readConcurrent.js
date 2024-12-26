import fetch from "node-fetch";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

// Number of concurrent requests per iteration
const CONCURRENT_REQUESTS = 10; 
// Number of iterations to run
const ITERATIONS = 200;
// Delay between iterations in milliseconds
const DELAY_BETWEEN_ITERATIONS = 1000; 

async function getTestNodes() {
  const query = `
    query {
      testNodes {
        id
        name
        createdAt
        updatedAt
      }
    }
  `;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  
  const data = await response.json();
  return data;
}

async function runConcurrentReads() {
  for (let i = 1; i <= ITERATIONS; i++) {
    console.log(`Iteration ${i}: Sending ${CONCURRENT_REQUESTS} concurrent testNodes queries.`);

    // Create an array of promises to run concurrently
    const promises = Array(CONCURRENT_REQUESTS).fill(null).map(() => getTestNodes());

    // Wait for all requests in this batch to complete
    const results = await Promise.all(promises);
    console.log(`Iteration ${i} results:`, results);

    if (i < ITERATIONS) {
      // Wait a bit before the next iteration
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_ITERATIONS));
    }
  }

  console.log("All iterations completed.");
}

runConcurrentReads().catch(console.error);
