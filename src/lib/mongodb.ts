import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

const dbName = "clientfinder-ai";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
  mongoClientPromise?: Promise<MongoClient>;
};

// Reuse the existing MongoDB client
const client =
  globalForMongo.mongoClient ?? new MongoClient(uri);

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = client;
}

// Reuse the existing connection promise
const clientPromise =
  globalForMongo.mongoClientPromise ?? client.connect();

if (!globalForMongo.mongoClientPromise) {
  globalForMongo.mongoClientPromise = clientPromise;
}

// Get database
export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export { client, clientPromise };