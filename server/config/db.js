const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    console.log('[Database] Connecting to MongoDB Atlas...');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `[Database] MongoDB Connected successfully to host: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    console.error('[Database Error]', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;