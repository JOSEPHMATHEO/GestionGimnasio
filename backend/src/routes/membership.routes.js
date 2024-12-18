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

router.use(protect);

router
  .route('/')
  .get(getMemberships)
  .post(authorize('admin', 'manager'), createMembership);

router
  .route('/:id')
  .get(getMembershipById)
  .put(authorize('admin', 'manager'), updateMembership)
  .delete(authorize('admin'), deleteMembership);

export default router;