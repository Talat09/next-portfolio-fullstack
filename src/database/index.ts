import "server-only";
import mongoose from "mongoose";

// Strip MongoDB query operators ($ne, $gt, ...) from user-supplied filter values.
mongoose.set("sanitizeFilter", true);

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  warnedLegacyEnv: boolean;
};

// Reuse one connection across hot reloads / serverless invocations.
const globalCache = globalThis as typeof globalThis & { __mongooseCache?: MongooseCache };
const cache: MongooseCache =
  globalCache.__mongooseCache ??
  (globalCache.__mongooseCache = { conn: null, promise: null, warnedLegacyEnv: false });

function getMongoUri(): string | undefined {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  // Legacy name kept so nothing breaks until the env var is renamed.
  // NEXT_PUBLIC_* values can be inlined into browser bundles: rename it to MONGODB_URI.
  const legacy = process.env.NEXT_PUBLIC_API_URL;
  if (legacy && !cache.warnedLegacyEnv) {
    cache.warnedLegacyEnv = true;
    console.warn(
      "[db] Using legacy NEXT_PUBLIC_API_URL for the database connection. Rename it to MONGODB_URI."
    );
  }
  return legacy;
}

export default async function connectToDB(): Promise<void> {
  try {
    if (cache.conn && mongoose.connection.readyState === 1) return;
    const uri = getMongoUri();
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }
    if (!cache.promise) {
      cache.promise = mongoose.connect(uri, {
        maxPoolSize: 10,
        // Fail fast so a DB outage cannot push a page past the serverless time limit.
        serverSelectionTimeoutMS: 4_000,
      });
    }
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    console.error(
      "Error connecting to the database:",
      e instanceof Error ? e.message : e
    );
  }
}
