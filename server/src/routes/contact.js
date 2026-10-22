import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { isDbReady } from '../lib/db.js';
import Message from '../models/Message.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many messages. Please try again in a few minutes.' },
});

function validate({ name, email, message }) {
  const errors = {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 80)
    errors.name = 'Please enter your name (2–80 characters).';
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim()) || email.length > 254)
    errors.email = 'Please enter a valid email address.';
  if (typeof message !== 'string' || message.trim().length < 10 || message.length > 2000)
    errors.message = 'Message should be 10–2000 characters.';
  return errors;
}

router.post('/contact', limiter, async (req, res) => {
  const { name, email, message, website } = req.body ?? {};

  // Honeypot: real users never fill the hidden "website" field.
  if (website) return res.status(201).json({ ok: true });

  const errors = validate({ name, email, message });
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors });

  if (!isDbReady()) return res.status(503).json({ error: 'Database unavailable. Please email me directly.' });

  const doc = await Message.create({ name: name.trim(), email: email.trim(), message: message.trim() });
  res.status(201).json({ ok: true, id: doc._id });
});

export default router;
