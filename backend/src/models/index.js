import mongoose from 'mongoose';

// Import models
import { User } from './user.model.js';
import { Class } from './class.model.js';
import { Booking } from './booking.model.js';
import { Membership } from './membership.model.js';

// Ensure all models are registered
const models = {
  User,
  Class,
  Booking,
  Membership
};

// Export all models
export {
  User,
  Class,
  Booking,
  Membership
};

// Export mongoose instance
export default mongoose;