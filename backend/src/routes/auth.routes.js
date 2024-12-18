import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);

export default router;