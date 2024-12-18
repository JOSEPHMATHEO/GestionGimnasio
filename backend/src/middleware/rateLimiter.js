import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again after 15 minutes',
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 100, // 1 minute
  max: 10000, // 100 requests per minute
  message: 'Too many requests, please try again later',
});