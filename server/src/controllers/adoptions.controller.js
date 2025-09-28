/** adoptions.controller.js — adopt a dog + optional food selection, list my adoptions */
import { Dog } from '../models/Dog.js';
import { Food } from '../models/Food.js';
import { Adoption } from '../models/Adoption.js';

export async function adoptDog(req, res, next) {
  try {
    const { id } = req.params;
    const { thankYouMessage, foodSelection = [] } = req.body || {};
    const dog = await Dog.findById(id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    if (dog.status === 'ADOPTED') return res.status(400).json({ error: 'Dog already adopted' });
    if (dog.ownerId.toString() === req.user.id) return res.status(400).json({ error: 'Cannot adopt your own dog' });

    // validate foods + stock
    const valid = [];
    for (const sel of foodSelection) {
      const f = await Food.findById(sel.foodId);
      if (!f) return res.status(400).json({ error: `Invalid food: ${sel.foodId}` });
      const qty = Math.max(1, Number(sel.qty) || 1);
      if (qty > f.stock) return res.status(400).json({ error: `Insufficient stock for ${f.name}` });
      valid.push({ f, qty });
    }
    // deduct stock
    for (const { f, qty } of valid) { f.stock -= qty; await f.save(); }

    dog.status = 'ADOPTED';
    dog.adoptedBy = req.user.id;
    await dog.save();

    const adoption = await Adoption.create({
      dogId: dog._id, adopterId: req.user.id, thankYouMessage,
      foodSelection: valid.map(({ f, qty }) => ({ foodId: f._id, qty }))
    });
    res.status(201).json({ message: 'Adopted', adoptionId: adoption._id });
  } catch (e) { next(e); }
}

export async function myAdoptions(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Adoption.find({ adopterId: req.user.id })
        .populate('dogId')
        .populate('foodSelection.foodId')
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Adoption.countDocuments({ adopterId: req.user.id })
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
}
