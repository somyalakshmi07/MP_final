import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://dbuser:Password%40123@cosmos-ecommerce.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000&appName=ecommerce-app';
    await mongoose.connect(mongoUri, {
      dbName: 'ecommerce', // Specify database name
      retryWrites: false, // Cosmos DB requires retryWrites=false
      tls: true,
      authMechanism: 'SCRAM-SHA-256',
      maxIdleTimeMS: 120000,
      minPoolSize: 5,
      maxPoolSize: 20,
    } as mongoose.ConnectOptions);
    console.log('✅ Connected to Azure Cosmos DB (ecommerce database)');
  } catch (error) {
    console.error('❌ Cosmos DB connection error:', error);
    process.exit(1);
  }
};
