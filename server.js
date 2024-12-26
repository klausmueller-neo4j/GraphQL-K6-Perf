import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { authMiddleware } from "./authMiddleware.js";
import { ogm } from "./ogm.js";
import driver from "./driver.js";
import { typeDefs } from "./schema.js";
import resolvers from "./resolvers.js";
import { Neo4jGraphQL } from "@neo4j/graphql";

dotenv.config();

async function startServer() {
  // Create a Neo4jGraphQL instance, passing in both typeDefs and resolvers
  const neo4jGraphQL = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers, // Ensure your custom mutation resolver is included here
  });

  // Generate the executable schema
  const schema = await neo4jGraphQL.getSchema();

  // Use this schema in ApolloServer
  const server = new ApolloServer({
    schema,
  });

  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        await authMiddleware(req);
        return {
          driver,
          neo4jDatabase: process.env.NEO4J_DATABASE,
          sessionConfig: { database: "neo4j" },
          req,
          ogm,
          cypherParams: {
            currentUserId: req?.user?.sub,
            userLabels: ["User", "Student", "Professor", "SchoolManager", "ExternalAdmin", "Parent"],
          },
          cypherQueryOptions: { runtime: "pipelined" },
        };
      },
    })
  );

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  });
}

startServer();