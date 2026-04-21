import express from 'express';
import multer from 'multer';
import { PDFDocument, degrees } from 'pdf-lib';
import fs from 'fs';
import { cleanupFiles, sendPdf } from '../utils/cleanup.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/merge', upload.array('pdfs'), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files.' });
    }
    const merged = await PDFDocument.create();
    for (const file of req.files) {
      const bytes = fs.readFileSync(file.path);
      const doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(page => merged.addPage(page));
    }
    const outBytes = await merged.save();
    cleanupFiles(req.files);
    sendPdf(res, outBytes, 'fukpdf-merge.pdf');
  } catch (err) {
    cleanupFiles(req.files);
    res.status(500).json({ error: err.message });
  }
});

router.post('/split', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file.' });
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes);
    const totalPages = doc.getPageCount();

    const rangeStr = req.body.range || `1-${totalPages}`;
    const pageIndices = parsePageRange(rangeStr, totalPages);
    if (pageIndices.length === 0) {
      cleanupFiles(req.file);
      return res.status(400).json({ error: 'Invalid page range. Use format: 1-3, 5, 7-9' });
    }

    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(doc, pageIndices);
    pages.forEach(page => newDoc.addPage(page));

    const outBytes = await newDoc.save();
    cleanupFiles(req.file);
    sendPdf(res, outBytes, 'fukpdf-split.pdf');
  } catch (err) {
    cleanupFiles(req.file);
    res.status(500).json({ error: err.message });
  }
});

router.post('/rotate', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file.' });
    const rotDegrees = parseInt(req.body.degrees) || 90;
    const pagesParam = req.body.pages || 'all';

    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes);
    const totalPages = doc.getPageCount();

    const pageIndices = pagesParam.trim().toLowerCase() === 'all'
      ? Array.from({ length: totalPages }, (_, i) => i)
      : parsePageRange(pagesParam, totalPages);

    pageIndices.forEach(i => {
      if (i >= 0 && i < totalPages) {
        const page = doc.getPage(i);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotDegrees) % 360));
      }
    });

    const outBytes = await doc.save();
    cleanupFiles(req.file);
    sendPdf(res, outBytes, 'fukpdf-rotate.pdf');
  } catch (err) {
    cleanupFiles(req.file);
    res.status(500).json({ error: err.message });
  }
});

router.post('/organize', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file.' });
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes);
    const totalPages = doc.getPageCount();

    const orderStr = req.body.pageOrder || Array.from({ length: totalPages }, (_, i) => i + 1).join(',');
    const order = orderStr.split(',')
      .map(s => parseInt(s.trim()) - 1)
      .filter(n => !isNaN(n) && n >= 0 && n < totalPages);

    if (order.length === 0) {
      cleanupFiles(req.file);
      return res.status(400).json({ error: 'Invalid page order. Use comma-separated 1-indexed page numbers.' });
    }

    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(doc, order);
    pages.forEach(page => newDoc.addPage(page));

    const outBytes = await newDoc.save();
    cleanupFiles(req.file);
    sendPdf(res, outBytes, 'fukpdf-organize.pdf');
  } catch (err) {
    cleanupFiles(req.file);
    res.status(500).json({ error: err.message });
  }
});

router.post('/crop', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file.' });
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes);

    const cropLeft   = clamp(parseFloat(req.body.cropLeft)   || 0, 0, 49) / 100;
    const cropRight  = clamp(parseFloat(req.body.cropRight)  || 0, 0, 49) / 100;
    const cropTop    = clamp(parseFloat(req.body.cropTop)    || 0, 0, 49) / 100;
    const cropBottom = clamp(parseFloat(req.body.cropBottom) || 0, 0, 49) / 100;

    doc.getPages().forEach(page => {
      const { width, height } = page.getSize();
      page.setCropBox(
        width  * cropLeft,
        height * cropBottom,
        width  * (1 - cropLeft - cropRight),
        height * (1 - cropTop - cropBottom)
      );
    });

    const outBytes = await doc.save();
    cleanupFiles(req.file);
    sendPdf(res, outBytes, 'fukpdf-crop.pdf');
  } catch (err) {
    cleanupFiles(req.file);
    res.status(500).json({ error: err.message });
  }
});

function parsePageRange(rangeStr, totalPages) {
  const indices = new Set();
  for (const part of rangeStr.split(',')) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [s, e] = trimmed.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(s) && !isNaN(e)) {
        for (let i = Math.max(1, s); i <= Math.min(e, totalPages); i++) indices.add(i - 1);
      }
    } else {
      const n = parseInt(trimmed);
      if (!isNaN(n) && n >= 1 && n <= totalPages) indices.add(n - 1);
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default router;
function toggleSidebar(){document.querySelector(".sidebar").classList.toggle("active")}
