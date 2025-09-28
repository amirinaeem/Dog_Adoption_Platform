/** User.js — User model with hashed password + role */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' }
}, { timestamps: true });

userSchema.methods.verifyPassword = function (pw) { return bcrypt.compare(pw, this.passwordHash); };
userSchema.statics.hashPassword = function (pw) { return bcrypt.hash(pw, 10); };

export const User = mongoose.model('User', userSchema);
