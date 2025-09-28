/** adoptions.routes.js — /api/adoptions routes */
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { adoptDog, myAdoptions } from '../controllers/adoptions.controller.js';

const router = Router();
router.use(requireAuth);
router.post('/:id', adoptDog);     // dogId
router.get('/mine', myAdoptions);
export default router;
