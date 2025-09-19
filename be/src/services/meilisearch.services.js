import { MeiliSearch } from "meilisearch";

// Create MeiliSearch client with proper error handling
const createMeiliClient = () => {
  try {
    const client = new MeiliSearch({
      host: process.env.MEILI_HOST || "http://localhost:7700",
      apiKey: process.env.MEILI_MASTER_KEY || "masterKey",
    });

    // Test the connection
    client.health().catch((err) => {
      console.warn("MeiliSearch connection warning:", err.message);
    });

    return client;
  } catch (error) {
    console.error("Failed to create MeiliSearch client:", error);
    return null;
  }
};

export const meiliClient = createMeiliClient();

// Create product index with error handling
export const productIndex = meiliClient ? meiliClient.index("products") : null;
