import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define new MONGODB_URI in env variable");
}

let cached = global.mongoose;

if (!cached) {
  const cached = (global.mongoose = { conn: null, promise: null });
}

export default async function connectionToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const opts = {
    bufferCommands: true,
    maxPoolSize: 10,
  };
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
