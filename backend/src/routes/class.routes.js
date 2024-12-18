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

router.use(protect);

router
  .route('/')
  .get(getClasses)
  .post(authorize('admin', 'manager', 'trainer'), createClass);

router
  .route('/:id')
  .get(getClassById)
  .put(authorize('admin', 'manager', 'trainer'), updateClass)
  .delete(authorize('admin', 'manager'), deleteClass);

export default router;