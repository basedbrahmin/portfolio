import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Frontend', 'Backend', 'Tools & Technologies'], required: true },
  level: { type: Number, min: 0, max: 100, required: true },
  top: { type: Boolean, default: false },
  note: String,
});

export default mongoose.model('Skill', skillSchema);
