import 'dotenv/config';
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import Profile from './models/Profile.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';
import TimelineItem from './models/TimelineItem.js';
import Certification from './models/Certification.js';
import Achievement from './models/Achievement.js';

const data = JSON.parse(readFileSync(new URL('./data/content.json', import.meta.url)));

if (!process.env.MONGODB_URI) {
  console.error('Set MONGODB_URI in server/.env first');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

// Replaces portfolio content only; contact messages are never touched.
const collections = [
  [Profile, [data.profile]],
  [Skill, data.skills],
  [Project, data.projects],
  [TimelineItem, data.timeline],
  [Certification, data.certifications],
  [Achievement, data.achievements],
];
for (const [Model, docs] of collections) {
  await Model.deleteMany({});
  await Model.insertMany(docs);
  console.log(`seeded ${docs.length} ${Model.collection.name}`);
}

await mongoose.disconnect();
