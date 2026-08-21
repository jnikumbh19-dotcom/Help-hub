import express from 'express';
import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';
import logger from './config/logger.js';
import { seedDatabase } from './seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if DB is empty (useful for in-memory/fresh installs)
    const userCount = await mongoose.connection.db.collection('users').countDocuments().catch(() => 0);
    if (userCount === 0) {
      logger.info('Empty database detected, auto-seeding...');
      await seedDatabase();
    }

    app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
