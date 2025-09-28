/** auth.middleware.js — requires a Bearer token, loads user into req.user */
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const raw = req.headers.authorization || '';
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    req.user = { id: user._id.toString(), username: user.username, role: user.role };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
