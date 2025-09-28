/** jwt.js — helper to sign/verify JWT tokens */
import jwt from 'jsonwebtoken';

export function signToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
