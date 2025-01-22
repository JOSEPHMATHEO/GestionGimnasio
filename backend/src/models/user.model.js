import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'trainer', 'client'],
    default: 'client',
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    validate: {
      validator: function(v) {
        // Solo requerir membresía si el rol es cliente
        return this.role !== 'client' || (this.role === 'client' && v);
      },
      message: 'Membership is required for clients'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create and export the model
const User = mongoose.model('User', userSchema);

export { User, userSchema };