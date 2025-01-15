import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
//import { apiLimiter } from './middleware/rateLimiter.js';
import { loggerMiddleware } from './middleware/logger.js';
import { errorHandler } from './middleware/error.js';

// Load environment variables first
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import membershipRoutes from './routes/membership.routes.js';
import classRoutes from './routes/class.routes.js';
import bookingRoutes from './routes/booking.routes.js';

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');

    const app = express();

    // CORS configuration
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Middleware
    app.use(express.json());
    app.use(loggerMiddleware);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/memberships', membershipRoutes);
    app.use('/api/classes', classRoutes);
    app.use('/api/bookings', bookingRoutes);

    // Error Handler
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();