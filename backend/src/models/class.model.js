import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  trainer: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al modelo User
  schedule: { 
    type: String,
    required: true },
  capacity: { 
    type: Number, 
    required: true },
});

export const Class = mongoose.model('class', classSchema);