// controllers/dogs.controller.js
import { Dog } from '../models/Dog.js';
import { Adoption } from '../models/Adoption.js';
import mongoose from 'mongoose';

export async function createDog(req, res, next) {
  try {
    const { name, description, breed, age, size } = req.body || {};
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const dog = await Dog.create({
      name,
      description,
      breed,
      age,
      size,
      ownerId: req.user.id
    });

    res.status(201).json(dog); // ✅ return whole dog with _id
  } catch (err) {
    next(err);
  }
}

export async function removeDog(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Invalid dog ID' });

    const dog = await Dog.findById(id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });

    if (dog.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only remove your own dogs' });
    }
    if (dog.status === 'ADOPTED') {
      return res.status(400).json({ error: 'Cannot remove adopted dog' });
    }

    await Adoption.deleteMany({ dogId: id });
    await dog.deleteOne();

    res.json({ message: 'Removed successfully', dogId: id });
  } catch (err) {
    next(err);
  }
}

export async function getMyDogs(req, res, next) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
    const query = { ownerId: req.user.id };
    if (status) query.status = status;

    const [items, total] = await Promise.all([
      Dog.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Dog.countDocuments(query)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
}

export async function getDogById(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid dog ID' });
    }

    const dog = await Dog.findById(id)
      .populate('ownerId', 'username')
      .populate('adoptedBy', 'username')
      .lean();

    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    res.json(dog);
  } catch (err) {
    next(err);
  }
}

export async function listAllDogs(req, res, next) {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
    const query = {};
    if (status) query.status = status;

    const [items, total] = await Promise.all([
      Dog.find(query)
        .populate('ownerId', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Dog.countDocuments(query)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
}
