import express from 'express';
import multer from 'multer';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { cleanupFiles, sendPdf, placeholder } from '../utils/cleanup.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

async function imagesToPdf(files, res, filename) {
  const doc = await PDFDocument.create();
  for (const file of files) {
    const imgBytes = fs.readFileSync(file.path);
    const mime = file.mimetype;
    let image;
    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      image = await doc.embedJpg(imgBytes);
    } else {
      image = await doc.embedPng(imgBytes);
    }
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const outBytes = await doc.save();
  cleanupFiles(files);
  sendPdf(res, outBytes, filename);
}

router.post('/jpg-to-pdf', upload.array('images'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image.' });
    }
    await imagesToPdf(req.files, res, 'from-images.pdf');
  } catch (err) {
    cleanupFiles(req.files);
    res.status(500).json({ error: err.message });
  }
});

router.post('/scan-to-pdf', upload.array('images'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one scanned image.' });
    }
    await imagesToPdf(req.files, res, 'scanned.pdf');
  } catch (err) {
    cleanupFiles(req.files);
    res.status(500).json({ error: err.message });
  }
});

router.post('/pdf-to-word',        (req, res) => placeholder(res, 'PDF to Word'));
router.post('/pdf-to-powerpoint',  (req, res) => placeholder(res, 'PDF to PowerPoint'));
router.post('/pdf-to-excel',       (req, res) => placeholder(res, 'PDF to Excel'));
router.post('/pdf-to-jpg',         (req, res) => placeholder(res, 'PDF to JPG'));
router.post('/word-to-pdf',        (req, res) => placeholder(res, 'Word to PDF'));
router.post('/powerpoint-to-pdf',  (req, res) => placeholder(res, 'PowerPoint to PDF'));
router.post('/excel-to-pdf',       (req, res) => placeholder(res, 'Excel to PDF'));
router.post('/html-to-pdf',        (req, res) => placeholder(res, 'HTML to PDF'));

export default router;
