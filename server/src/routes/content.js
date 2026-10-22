import { Router } from 'express';
import { readFileSync } from 'node:fs';
import { isDbReady } from '../lib/db.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import TimelineItem from '../models/TimelineItem.js';
import Certification from '../models/Certification.js';
import Achievement from '../models/Achievement.js';

const seed = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const router = Router();

// Every reader falls back to the seed file when MongoDB is unavailable,
// so the site still renders locally without a database.
const readers = {
  profile: () => (isDbReady() ? Profile.findOne().lean() : seed.profile),
  skills: () => (isDbReady() ? Skill.find().lean() : seed.skills),
  projects: () => (isDbReady() ? Project.find().sort({ order: 1 }).lean() : seed.projects),
  timeline: () => (isDbReady() ? TimelineItem.find().sort({ order: 1 }).lean() : seed.timeline),
  certifications: () => (isDbReady() ? Certification.find().lean() : seed.certifications),
  achievements: () => (isDbReady() ? Achievement.find().lean() : seed.achievements),
};

router.get('/content', async (req, res) => {
  const keys = Object.keys(readers);
  const values = await Promise.all(keys.map((k) => readers[k]()));
  res.json(Object.fromEntries(keys.map((k, i) => [k, values[i]])));
});

router.get('/profile', async (req, res) => res.json(await readers.profile()));
router.get('/skills', async (req, res) => res.json(await readers.skills()));
router.get('/projects', async (req, res) => res.json(await readers.projects()));
router.get('/timeline', async (req, res) => res.json(await readers.timeline()));
router.get('/certifications', async (req, res) => res.json(await readers.certifications()));
router.get('/achievements', async (req, res) => res.json(await readers.achievements()));

router.get('/projects/:slug', async (req, res) => {
  const project = isDbReady()
    ? await Project.findOne({ slug: req.params.slug }).lean()
    : seed.projects.find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

export default router;
