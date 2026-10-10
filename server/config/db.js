import mongoose from 'mongoose';
import { ENV } from './env.js';

/**
 * Connect to MongoDB with connection pooling optimized for 500 concurrent users.
 */
export async function connectDB() {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      maxPoolSize: 50, // Connection pool for concurrent operations
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // In local development, allow server to run for testing or fallback
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
}

/**
 * Disconnect cleanly for tests and graceful shutdown.
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected cleanly');
  } catch (error) {
    console.error(`[MongoDB] Disconnect error: ${error.message}`);
  }
}
