import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../utils/db.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const COOKIE = 'ilovepdf_token';
const QUOTA = 2 * 1024 * 1024 * 1024; // 2 GB

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '30d' });
}

function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function publicUser(u) {
  return {
    id: u.id, email: u.email, name: u.name,
    storage_quota: u.storage_quota,
    storage_used:  u.storage_used,
    avatar_url:    u.avatar_url || null,
  };
}

router.post('/auth/signup', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ error: 'Name, email and password are required.' });
  if (password.length < 6)             return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  if (db.prepare('SELECT id FROM users WHERE email=?').get(email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(`
    INSERT INTO users (email, name, password_hash, storage_quota, storage_used)
    VALUES (?, ?, ?, ?, 0)
  `).run(email.toLowerCase(), name.trim(), hash, QUOTA);
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(info.lastInsertRowid);
  res.cookie(COOKIE, sign(user), { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json({ user: publicUser(user) });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(String(email).toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  res.cookie(COOKIE, sign(user), { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json({ user: publicUser(user) });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

router.get('/auth/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

// Optional: simulate consuming or releasing storage
router.post('/auth/storage', authMiddleware, (req, res) => {
  const delta = parseInt(req.body?.delta, 10);
  if (!Number.isFinite(delta)) return res.status(400).json({ error: 'delta required' });
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  const next = Math.max(0, Math.min(user.storage_quota, user.storage_used + delta));
  db.prepare('UPDATE users SET storage_used=? WHERE id=?').run(next, user.id);
  res.json({ user: publicUser({ ...user, storage_used: next }) });
});

export default router;
