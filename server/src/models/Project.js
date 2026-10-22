import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tagline: String,
  description: String,
  year: Number,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  role: String,
  tech: [String],
  github: String,
  live: String,
  overview: String,
  highlights: [String],
  image: String,
});

export default mongoose.model('Project', projectSchema);
