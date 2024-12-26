import http from 'k6/http';
import { check, sleep } from 'k6';

const url = 'http://host.docker.internal:4000/graphql'; 

// GraphQL mutation (write)
const createTestNodeMutation = `
  mutation {
    createTestNode
  }
`;

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% of requests should finish within 5s
    http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
  },
  scenarios: {
    // A more extended average load scenario: ramp up and then ramp down
    average: {
      executor: 'ramping-vus',
      startTime: '1m', // start after the smoke test is done
      startVUs: 1,
      stages: [
        { duration: '5m', target: 1000 },  // Ramp from 0 (or startVUs) to 1,000 VUs over 5 minutes
        { duration: '10m', target: 3000 }, // Then ramp from 1,000 to 3,000 VUs over 10 minutes
        { duration: '10m', target: 6000 }, // Ramp from 3,000 to 6,000 VUs over 10 minutes
        { duration: '5m', target: 6000 },  // Hold at 6,000 VUs for 5 minutes
        { duration: '5m', target: 10000 }, 
        { duration: '5m', target: 0 }, 
      ],
      exec: 'writeTest', // Use the same function to test writes under varying load
    },
  },
};

// The function to be executed by both scenarios
export function writeTest() {
  // Perform the write (mutation)
  const mutationRes = http.post(url, JSON.stringify({ query: createTestNodeMutation }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const checks = check(mutationRes, {
    'mutation status 200': (r) => r.status === 200,
    'mutation success returned': (r) => r.json().data && r.json().data.createTestNode === 'success',
  });


  // Sleep 2 seconds after each iteration
  sleep(2);
}
