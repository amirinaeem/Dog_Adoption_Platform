/** dogs.controller.js — CRUD-ish for dogs (owner-scoped), lookup by id */
import { Dog } from '../models/Dog.js';

export async function createDog(req, res, next) {
  try {
    const { name, description } = req.body || {};
    if (!name || !description) return res.status(400).json({ error: 'name and description required' });
    const dog = await Dog.create({ name, description, ownerId: req.user.id });
    res.status(201).json(dog);
  } catch (e) { next(e); }
}

export async function removeDog(req, res, next) {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    if (dog.ownerId.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (dog.status === 'ADOPTED') return res.status(400).json({ error: 'Cannot remove adopted dog' });
    await dog.deleteOne();
    res.json({ message: 'Removed' });
  } catch (e) { next(e); }
}

export async function getMyDogs(req, res, next) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const q = { ownerId: req.user.id };
    if (status) q.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Dog.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Dog.countDocuments(q)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
}

export async function getDogById(req, res, next) {
  try {
    const dog = await Dog.findById(req.params.id).lean();
    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    res.json(dog);
  } catch (e) { next(e); }
}

export async function listAllDogs(req, res, next) {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const q = {};
    if (status) q.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Dog.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Dog.countDocuments(q)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
}
