/** rateLimit.middleware.js — basic shared limiter */
import rateLimit from 'express-rate-limit';
export const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: 'draft-7' });
