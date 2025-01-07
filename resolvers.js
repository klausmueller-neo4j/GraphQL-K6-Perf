import { randomUUID } from "crypto";
import { write } from "./neo4j-utils.js";

export default {
  Mutation: {
    createTestNode: async () => {
      try {
        const nowDate = new Date().toISOString();
        const params = {
          id: randomUUID(),
          name: Date.now().toString(24).toUpperCase(),
          createdAt: nowDate,
          updatedAt: nowDate,
        };

        const startTime = Date.now();
        const result = await write(`
          CREATE(n:TestNode {
            id: $id,
            name: $name,
            createdAt: $createdAt,
            updatedAt: $updatedAt
            })`,
          params
        );
        const endTime = Date.now();
        console.log(`GraphQL Mutation Latency: ${endTime - startTime} ms`);


        return "success";
      } catch (error) {
        console.error(`[CREATE_TEST_NODE] Error: `, error);
        throw new Error("Failed to create test node");
      }
    },
  },
};
