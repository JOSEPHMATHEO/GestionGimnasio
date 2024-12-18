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

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'manager', 'trainer'), getBookings)
  .post(createBooking); // All authenticated users can create bookings

router
  .route('/:id')
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;