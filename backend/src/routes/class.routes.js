import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/class.controller.js';

const router = express.Router();



router.route('/')
  .get(getClasses)
  .post(protect, authorize('admin', 'manager', 'trainer'), createClass);

router.route('/:id')
  .get(protect, getClassById)
  .put(protect, authorize('admin', 'manager', 'trainer'), updateClass)
  .delete(protect, authorize('admin', 'manager'), deleteClass);

export default router;