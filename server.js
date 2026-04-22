import compression from 'compression';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import organizeRouter from './routes/organize.js';
import editRouter from './routes/edit.js';
import convertRouter from './routes/convert.js';
import securityRouter from './routes/security.js';
import advancedRouter from './routes/advanced.js';
import imageRouter from './routes/image.js';
import authRouter from './routes/auth.js';
import { SLUG_MAP, buildHtml, getRedirect } from './utils/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT||5000;
const app = express();
app.use(compression());
app.use(express.static('public'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'ILovePDF');
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please wait 15 minutes and try again.' }
});

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiLimiter);
app.use('/api', authRouter);
app.use('/api', organizeRouter);
app.use('/api', editRouter);
app.use('/api', convertRouter);
app.use('/api', securityRouter);
app.use('/api', advancedRouter);
app.use('/api', imageRouter);

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum allowed size is 100 MB. Sign up required for larger files.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request too large.' });
  }
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── SEO routes: /merge-pdf, /split-pdf, /pdf-to-word, /numbers-to-words … ──
const TOOL_HTML = fs.readFileSync(path.join(__dirname, 'public', 'tool.html'), 'utf8');
app.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;
  if (!Object.prototype.hasOwnProperty.call(SLUG_MAP, slug)) return next();
  const redir = getRedirect(slug);
  if (redir) return res.redirect(302, redir);
  const html = buildHtml(slug, TOOL_HTML);
  if (!html) return next();
  res.set('Cache-Control', 'public, max-age=300');
  res.type('html').send(html);
});

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ILovePDF running on port ${PORT}`);
});
