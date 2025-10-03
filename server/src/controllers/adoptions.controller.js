// controllers/adoptions.controller.js
import mongoose from 'mongoose';
import { Dog } from '../models/Dog.js';
import { Food } from '../models/Food.js';
import { Adoption } from '../models/Adoption.js';

export async function adoptDog(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { thankYouMessage, foodSelection = [] } = req.body || {};

    // Validate dog ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid dog ID' });
    }

    const dog = await Dog.findById(id).session(session);
    if (!dog) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Dog not found' });
    }

    if (dog.ownerId.toString() === req.user.id) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot adopt your own dog' });
    }

    if (dog.status === 'ADOPTED') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Dog already adopted' });
    }

    // Validate and update food stock
    const validFood = [];
    for (const sel of foodSelection) {
      if (!sel.foodId || !mongoose.Types.ObjectId.isValid(sel.foodId)) {
        await session.abortTransaction();
        return res.status(400).json({ error: 'Invalid food ID' });
      }

      const food = await Food.findById(sel.foodId).session(session);
      if (!food) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Food not found: ${sel.foodId}` });
      }

      const qty = Math.max(1, Number(sel.qty) || 1);
      if (qty > food.stock) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Insufficient stock for ${food.name}` });
      }

      food.stock -= qty;
      await food.save({ session });
      validFood.push({ foodId: food._id, qty });
    }

    // Mark dog adopted
    dog.status = 'ADOPTED';
    dog.adoptedBy = req.user.id;
    await dog.save({ session });

    const adoption = await Adoption.create([{
      dogId: dog._id,
      adopterId: req.user.id,
      thankYouMessage,
      foodSelection: validFood
    }], { session });

    await session.commitTransaction();
    res.status(201).json({
      message: 'Adopted successfully',
      adoptionId: adoption[0]._id
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
}

export async function myAdoptions(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));

    const [items, total] = await Promise.all([
      Adoption.find({ adopterId: req.user.id })
        .populate('dogId')
        .populate('foodSelection.foodId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.max(1, Number(limit)))
        .lean(),
      Adoption.countDocuments({ adopterId: req.user.id })
    ]);

    res.json({
      items,
      total,
      page: Math.max(1, Number(page)),
      pages: Math.ceil(total / Math.max(1, Number(limit)))
    });
  } catch (err) {
    next(err);
  }
}
