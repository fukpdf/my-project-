import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import organizeRouter from './routes/organize.js';
import editRouter from './routes/edit.js';
import convertRouter from './routes/convert.js';
import securityRouter from './routes/security.js';
import advancedRouter from './routes/advanced.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;
const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', organizeRouter);
app.use('/api', editRouter);
app.use('/api', convertRouter);
app.use('/api', securityRouter);
app.use('/api', advancedRouter);

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PDF Tools Pro running on port ${PORT}`);
});
