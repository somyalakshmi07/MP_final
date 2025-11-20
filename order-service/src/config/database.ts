import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://somyalakshmi17_db_user:9ft7qNZWLA5IqWUd@cluster0.v1rzlcu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-app';
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      appName: 'ecommerce-app',
      tls: true,
      tlsAllowInvalidCertificates: false,
      minPoolSize: 5,
      maxPoolSize: 20,
    });
    console.log('✅ Connected to MongoDB Atlas (ecommerce database)');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
