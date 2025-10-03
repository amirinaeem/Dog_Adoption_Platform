// controllers/auth.controller.js
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const user = await User.create({ username, passwordHash: password });

    res.status(201).json({
      id: user._id,
      username: user.username,
      message: 'User registered successfully'
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user._id, role: user.role }, '24h');

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
}
