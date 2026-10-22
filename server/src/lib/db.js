import mongoose from 'mongoose';

export const isDbReady = () => mongoose.connection.readyState === 1;

export async function connectDb(uri) {
  if (!uri) {
    console.warn('[db] MONGODB_URI not set: content served from seed file, contact form disabled');
    return;
  }
  await mongoose.connect(uri);
  console.log('[db] connected');
}
