import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(protect); // Protect all routes

// Admin and manager routes
router
  .route('/')
  .get(authorize('admin', 'manager'), getUsers)
  .post(authorize('admin', 'manager'), createUser);

router
  .route('/:id')
  .get(authorize('admin', 'manager', 'trainer'), getUserById)
  .put(authorize('admin', 'manager'), updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;