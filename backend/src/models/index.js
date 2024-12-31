// Central file to export all models and ensure they are registered
import mongoose from 'mongoose';
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

// Register any models that haven't been registered yet
Object.entries(models).forEach(([modelName, model]) => {
  if (!mongoose.models[modelName]) {
    mongoose.model(modelName, model.schema);
  }
});

export {
  User,
  Class,
  Booking,
  Membership
};