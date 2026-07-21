import mongoose from 'mongoose';
export async function connectDatabase(uri: string) {
  try {
    await mongoose.connect(uri);

    console.log('Database connected successfully');
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error);

    process.exit(1);

  }
}