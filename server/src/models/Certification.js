import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: String,
  date: String,
  url: String,
  image: String,
});

export default mongoose.model('Certification', certificationSchema);
