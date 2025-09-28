/** foods.controller.js — create/list Food Bank items (stock-aware) */
import { Food } from '../models/Food.js';

export async function createFood(req, res, next) {
  try {
    const { name, brand, stock = 0, notes } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name required' });
    const food = await Food.create({ name, brand, stock, notes });
    res.status(201).json(food);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: 'Food name already exists' });
    next(e);
  }
}
export async function listFood(req, res, next) {
  try { res.json(await Food.find().sort({ name: 1 }).lean()); }
  catch (e) { next(e); }
}
