/** foods.routes.js — /api/foods routes */
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { createFood, listFood } from '../controllers/foods.controller.js';

const router = Router();
router.get('/', listFood);
router.post('/', requireAuth, createFood); // allow any authed user to seed
export default router;
