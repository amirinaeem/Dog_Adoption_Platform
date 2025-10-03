// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' }
}, { 
  timestamps: true 
});

// Hash password before saving if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method: verify password
userSchema.methods.verifyPassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Static helper: hash password externally if needed
userSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const User = mongoose.model('User', userSchema);
