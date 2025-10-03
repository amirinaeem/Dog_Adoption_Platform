// models/Dog.js
import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  description: { 
    type: String, 
    required: true, 
    trim: true
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ADOPTED'], 
    default: 'PENDING' 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  adoptedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  }
}, { 
  timestamps: true 
});

// useful index for queries by owner
dogSchema.index({ ownerId: 1, status: 1 });

export const Dog = mongoose.model('Dog', dogSchema);
