import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  detail: String,
  year: String,
});

export default mongoose.model('Achievement', achievementSchema);
