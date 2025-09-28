/** dogs.routes.js — /api/dogs routes (auth required) */
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';
import { createDog, removeDog, getMyDogs, getDogById, listAllDogs } from '../controllers/dogs.controller.js';

const router = Router();
router.get('/', listAllDogs); // public list (optional auth)
router.use(requireAuth, apiLimiter);
router.post('/', createDog);
router.get('/mine', getMyDogs);
router.get('/:id', getDogById);
router.delete('/:id', removeDog);
export default router;
