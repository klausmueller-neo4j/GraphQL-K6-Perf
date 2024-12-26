// resolvers.js
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

        await write(`
          CREATE(n:TestNode {
            id: $id,
            name: $name,
            createdAt: $createdAt,
            updatedAt: $updatedAt
            })`,
          params
        );

        return "success";
      } catch (error) {
        console.error(`[CREATE_TEST_NODE] Error: `, error);
        // Consider throwing an error or returning a user-friendly message
        throw new Error("Failed to create test node");
      }
    },
  },
};