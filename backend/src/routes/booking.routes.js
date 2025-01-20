import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/booking.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes with role-based authorization
router.route('/')
  .get(getBookings) // All authenticated users can view their relevant bookings
  .post(createBooking); // All authenticated users can create bookings

router.route('/:id')
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;