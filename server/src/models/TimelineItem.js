import mongoose from 'mongoose';

const timelineItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['Education', 'Experience'], required: true },
  title: { type: String, required: true },
  org: String,
  location: String,
  start: String,
  end: String,
  description: String,
  order: { type: Number, default: 0 },
});

export default mongoose.model('TimelineItem', timelineItemSchema);
