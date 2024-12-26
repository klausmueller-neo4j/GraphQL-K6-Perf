import { OGM } from "@neo4j/graphql-ogm";
import driver from "./driver.js";
import { typeDefs } from "./schema.js";

export const ogm = new OGM({
  typeDefs,
  driver,
  config: { enableRegex: true },
});

await ogm.init();
