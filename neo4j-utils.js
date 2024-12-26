import driver from "./driver.js";

export async function read(cypher, params = {}) {
  const session = driver.session({ database: process.env.NEO4J_DATABASE || "neo4j" });
  try {
    const response = await session.executeRead((tx) => tx.run(cypher, params));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
}

export async function write(cypher, params = {}) {
  const session = driver.session({ database: process.env.NEO4J_DATABASE || "neo4j" });
  try {
    const response = await session.executeWrite((tx) => tx.run(cypher, params));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
}
