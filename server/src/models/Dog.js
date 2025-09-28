/** Dog.js — Dog listing registered by owner, track adoption */
import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['PENDING', 'ADOPTED'], default: 'PENDING' },
  ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  adoptedBy: { type: mongoose.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Dog = mongoose.model('Dog', dogSchema);
