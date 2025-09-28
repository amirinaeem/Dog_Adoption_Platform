/** Food.js — Food Bank items selectable during adoption (stock-aware) */
import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  brand: { type: String, trim: true },
  stock: { type: Number, default: 0, min: 0 },
  notes: { type: String }
}, { timestamps: true });

export const Food = mongoose.model('Food', foodSchema);
