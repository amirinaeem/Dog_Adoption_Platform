// models/Adoption.js
import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
  dogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
  adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thankYouMessage: { type: String, trim: true },
  foodSelection: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    qty: { type: Number, default: 1, min: 1 }
  }]
}, { 
  timestamps: true 
});

// optional index to prevent duplicate adoption of same dog by same user
adoptionSchema.index({ dogId: 1, adopterId: 1 }, { unique: true });

export const Adoption = mongoose.model('Adoption', adoptionSchema);
