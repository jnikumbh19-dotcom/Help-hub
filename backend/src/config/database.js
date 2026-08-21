import mongoose from 'mongoose';
import { env } from './env.js';
import logger from './logger.js';

let mongoServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    let uri = env.MONGODB_URI;

    // If using in-memory DB (development without MongoDB installed)
    if (env.USE_MEMORY_DB === 'true' || env.NODE_ENV === 'development') {
      try {
        // Try connecting to the configured URI first
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
        return;
      } catch (err) {
        // If connection fails, fall back to in-memory server
        logger.warn('MongoDB not available, starting in-memory database...');
        let MongoMemoryServer;
        try {
          const mod = await import('mongodb-memory-server-core');
          MongoMemoryServer = mod.MongoMemoryServer;
        } catch {
          const mod = await import('mongodb-memory-server');
          MongoMemoryServer = mod.MongoMemoryServer;
        }
        mongoServer = await MongoMemoryServer.create({
          binary: {
            version: '6.0.19'
          }
        });
        uri = mongoServer.getUri();
      }
    }

    await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
