import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getStats,
  getTrainerStats,
  getClientStats,
} from '../controllers/stats.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes with role-based authorization
router.get('/', authorize('admin', 'manager'), getStats);
router.get('/trainer', authorize('trainer'), getTrainerStats);
router.get('/client', authorize('client'), getClientStats);

export default router;