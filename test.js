import http from 'k6/http';
import { check, sleep } from 'k6';

const url = 'http://host.docker.internal:4000/graphql'; 

const createTestNodeMutation = `
  mutation {
    createTestNode
  }
`;

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.01'],
  },
  scenarios: {
    average: {
      executor: 'ramping-vus',
      startTime: '1m',
      startVUs: 1,
      stages: [
        { duration: '5m', target: 1000 },
        { duration: '10m', target: 3000 },
        { duration: '10m', target: 6000 },
        { duration: '5m', target: 6000 },
        { duration: '5m', target: 10000 }, 
        { duration: '5m', target: 0 }, 
      ],
      exec: 'writeTest',
    },
  },
};

export function writeTest() {
  const startTime = Date.now();
  const mutationRes = http.post(url, JSON.stringify({ query: createTestNodeMutation }), {
    headers: { 'Content-Type': 'application/json' },
  });
  const endTime = Date.now();
  
  console.log(`GraphQL API Latency: ${endTime - startTime} ms`);

  check(mutationRes, {
    'mutation status 200': (r) => r.status === 200,
    'mutation success returned': (r) => r.json().data && r.json().data.createTestNode === 'success',
  });
  sleep(2);
}
