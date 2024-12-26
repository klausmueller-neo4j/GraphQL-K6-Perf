# Neo4j GraphQL API with Apollo Server

This project sets up a GraphQL API using Apollo Server, Neo4j, and Express. It allows for creating `TestNode` entities in a Neo4j database through GraphQL mutations.

## Features
- **GraphQL API** – Exposes GraphQL endpoints to interact with Neo4j.
- **Mutations** – Supports creating `TestNode` entities with random UUIDs and timestamps.
- **Performance Testing** – Uses k6 to stress-test the API.

---

## Running the Server

### Start the Server
Run the following command to start the server:

node server.js

The server will be accessible at:

http://localhost:4000/graphql

Test the GraphQL Mutation
You can test the createTestNode mutation by running the following GraphQL query:
mutation {
  createTestNode
}

## Performance Testing with k6
To perform load testing with k6, use the following Docker command:

docker run --rm -i \
  -v "$(pwd):/scripts" \
  -w /scripts \
  grafana/k6 run test.js

Explanation:
-  --rm – Automatically removes the container after the test completes.
-  -i – Runs the container interactively.
-  -v "$(pwd):/scripts" – Mounts the current directory into the container under /scripts.
-  -w /scripts – Sets the working directory inside the container to /scripts.
-  grafana/k6 run test.js – Executes the k6 test script.

Ensure that your test.js script is in the project root directory.

## Notes
Ensure Docker is installed and running.
Adjust the paths if your project directory structure is different.

