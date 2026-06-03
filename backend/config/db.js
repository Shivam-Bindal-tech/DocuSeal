const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing from environment variables');
    throw new Error('MONGO_URI is required');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

module.exports = connectDB;
