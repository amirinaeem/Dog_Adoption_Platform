/** db.js — MongoDB connection handler */
import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in environment variables.');
    process.exit(1);
  }

  try {
    // Remove deprecated options for newer mongoose versions
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'dog_adoption',
    });

    console.log(`✅ Connected to MongoDB: ${mongoose.connection.db.databaseName}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB connection lost');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}