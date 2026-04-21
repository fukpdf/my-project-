const compression = require('compression');
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

import organizeRouter from './routes/organize.js';
import editRouter from './routes/edit.js';
import convertRouter from './routes/convert.js';
import securityRouter from './routes/security.js';
import advancedRouter from './routes/advanced.js';
import imageRouter from './routes/image.js';

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
  res.setHeader('X-Powered-By', 'FUKPDF');
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please wait 15 minutes and try again.' }
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiLimiter);
app.use('/api', organizeRouter);
app.use('/api', editRouter);
app.use('/api', convertRouter);
app.use('/api', securityRouter);
app.use('/api', advancedRouter);
app.use('/api', imageRouter);

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum allowed size is 10 MB.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request too large.' });
  }
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`FUKPDF running on port ${PORT}`);
});
