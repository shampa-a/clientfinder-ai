import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error("MONGODB_URL is not defined in .env.local");
}

const dbName = "clientfinder-ai";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

const clientPromise =
  globalForMongo.mongoClientPromise ??
  new MongoClient(uri).connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}