import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb, isDbReady } from './lib/db.js';
import contentRoutes from './routes/content.js';
import contactRoutes from './routes/contact.js';
import cvRoutes from './routes/cv.js';
import { startKeepAlive } from './lib/keepAlive.js';

const { PORT = 5000, MONGODB_URI, CLIENT_URL = '' } = process.env;

// Browsers may only call the API from the deployed frontend, local dev, or extra origins in CLIENT_URL.
const allowedOrigins = [
  'https://portfolio-basedbrahmin.vercel.app',
  'http://localhost:5173',
  ...CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, '')).filter(Boolean),
];
const app = express();

app.set('trust proxy', 1); // behind Render/Railway proxy, needed for rate limiting
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, db: isDbReady() }));
app.use('/api', contentRoutes);
app.use('/api', contactRoutes);
app.use('/api', cvRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'Something went wrong' });
});

try {
  await connectDb(MONGODB_URI);
} catch (err) {
  console.error('[db] connection failed:', err.message);
}
app.listen(PORT, () => console.log(`[api] listening on :${PORT}`));

// Render sets RENDER_EXTERNAL_URL automatically, so this needs no configuration.
startKeepAlive(process.env.RENDER_EXTERNAL_URL);
