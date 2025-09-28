/** Adoption.js — records adoption + food selection */
import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
  dogId: { type: mongoose.Types.ObjectId, ref: 'Dog', required: true },
  adopterId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  thankYouMessage: { type: String },
  foodSelection: [{
    foodId: { type: mongoose.Types.ObjectId, ref: 'Food', required: true },
    qty: { type: Number, default: 1, min: 1 }
  }]
}, { timestamps: true });

export const Adoption = mongoose.model('Adoption', adoptionSchema);
