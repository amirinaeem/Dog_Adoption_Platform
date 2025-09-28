/**
 * db.js — MongoDB connection handler (Mongoose + Atlas/local)
 * Ensures stable connection, logs status, and gracefully handles errors.
 */
import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in environment variables.');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'dog_adoption',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Connected to MongoDB database: ${process.env.MONGODB_DB || 'dog_adoption'}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB connection lost. Retrying...');
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}
