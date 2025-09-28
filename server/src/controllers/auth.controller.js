/** auth.controller.js — register/login with password hashing + JWT */
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'username already taken' });
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ username, passwordHash });
    res.status(201).json({ id: user._id, username: user.username });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = signToken({ id: user._id, role: user.role }, '24h');
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (e) { next(e); }
}
