// controllers/foods.controller.js
import { Food } from '../models/Food.js';

export async function createFood(req, res, next) {
  try {
    const { name, brand, stock = 0, notes } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const food = await Food.create({ name, brand, stock, notes });
    res.status(201).json(food);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Food name already exists' });
    }
    next(err);
  }
}

export async function listFood(req, res, next) {
  try {
    const foods = await Food.find().sort({ name: 1 }).lean();
    res.json(foods);
  } catch (err) {
    next(err);
  }
}
