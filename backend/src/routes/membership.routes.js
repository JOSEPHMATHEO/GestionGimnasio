import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
} from '../controllers/membership.controller.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getMemberships);
router.get('/:id', getMembershipById);

// Protected routes
router.use(protect);
router.post('/', authorize('admin', 'manager'), createMembership);
router.put('/:id', authorize('admin', 'manager'), updateMembership);
router.delete('/:id', authorize('admin'), deleteMembership);

export default router;