/** index.routes.js — mounts all /api routes */
import { Router } from 'express';
import auth from './auth.routes.js';
import dogs from './dogs.routes.js';
import adoptions from './adoptions.routes.js';
import foods from './foods.routes.js';

const router = Router();
router.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));
router.use('/auth', auth);
router.use('/dogs', dogs);
router.use('/adoptions', adoptions);
router.use('/foods', foods);
export default router;
