import express from 'express';
import multer from 'multer';
import { placeholder } from '../utils/cleanup.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/repair',       (req, res) => placeholder(res, 'PDF Repair'));
router.post('/ocr',          (req, res) => placeholder(res, 'OCR PDF'));
router.post('/compare',      (req, res) => placeholder(res, 'Compare PDF'));
router.post('/ai-summarize', (req, res) => placeholder(res, 'AI Summarizer'));
router.post('/translate',    (req, res) => placeholder(res, 'Translate PDF'));
router.post('/workflow',     (req, res) => placeholder(res, 'Workflow Builder'));

export default router;
