import express from 'express';
import multer from 'multer';
import { placeholder } from '../utils/cleanup.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/protect', upload.single('pdf'), (req, res) => placeholder(res, 'Protect PDF'));
router.post('/unlock',  upload.single('pdf'), (req, res) => placeholder(res, 'Unlock PDF'));

export default router;
