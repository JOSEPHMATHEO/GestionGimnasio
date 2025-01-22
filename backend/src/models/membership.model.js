import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
export const Membership = mongoose.model('Membership', membershipSchema);

// Export the schema separately if needed
export { membershipSchema };