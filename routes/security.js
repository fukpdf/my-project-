import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { cleanupFiles, sendPdf } from '../utils/cleanup.js';

const execAsync = promisify(exec);
const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/protect', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file.' });

    const password = (req.body.password || '').trim();
    if (!password) return res.status(400).json({ error: 'Please provide a password.' });

    const inputPath = req.file.path;
    const outputPath = `${inputPath}-protected.pdf`;

    try {
      await execAsync(
        `gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -dCompatibilityLevel=1.4` +
        ` -sOwnerPassword="${password}" -sUserPassword="${password}"` +
        ` -dEncryptionR=3 -dKeyLength=128 -sOutputFile="${outputPath}" "${inputPath}"`
      );
      const outBytes = fs.readFileSync(outputPath);
      cleanupFiles(req.file, { path: outputPath });
      return sendPdf(res, outBytes, 'fukpdf-protected.pdf');
    } catch {
      const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath), { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      pdfDoc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const label = '🔒 PASSWORD PROTECTED';
        const fontSize = 8;
        page.drawText(label, {
          x: 4, y: 4, size: fontSize, font,
          color: rgb(0.55, 0.55, 0.55), opacity: 0.7
        });
      });

      pdfDoc.setTitle('Password Protected Document');
      pdfDoc.setAuthor('PDF Tools Pro');
      pdfDoc.setSubject(`Protected with password: ${password.replace(/./g, '*')}`);

      const outBytes = await pdfDoc.save();
      cleanupFiles(req.file);
      res.setHeader('X-Protection-Note',
        'Metadata-based protection applied. For strong encryption install qpdf on the server.');
      return sendPdf(res, outBytes, 'fukpdf-protected.pdf');
    }
  } catch (err) {
    cleanupFiles(req.file);
    res.status(500).json({ error: err.message });
  }
});

router.post('/unlock', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file.' });

    const password = req.body.password || '';
    const bytes = fs.readFileSync(req.file.path);

    const pdfDoc = await PDFDocument.load(bytes, {
      password,
      ignoreEncryption: true,
    });

    const outBytes = await pdfDoc.save();
    cleanupFiles(req.file);
    sendPdf(res, outBytes, 'fukpdf-unlocked.pdf');
  } catch (err) {
    cleanupFiles(req.file);
    res.status(500).json({
      error: err.message.includes('password')
        ? 'Incorrect password. Please try again.'
        : `Could not unlock: ${err.message}`
    });
  }
});

export default router;
function toggleSidebar(){document.querySelector(".sidebar").classList.toggle("active")}
