import { User } from '../models/user.model.js';
import { Class } from '../models/class.model.js';
import { Booking } from '../models/booking.model.js';
import { Membership } from '../models/membership.model.js';
import asyncHandler from 'express-async-handler';

// General stats for admin and manager
export const getStats = asyncHandler(async (req, res) => {
  try {
    // Verify user authentication and role
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    console.log('Fetching stats for user:', req.user._id);

    // Get basic counts with error handling
    const [totalClients, totalTrainers] = await Promise.all([
      User.countDocuments({ role: 'client' }).exec(),
      User.countDocuments({ role: 'trainer' }).exec()
    ]);

    console.log('Basic counts:', { totalClients, totalTrainers });

    // Get clients with memberships
    const clientsWithMemberships = await User.find({
      role: 'client',
      membership: { $exists: true, $ne: null }
    })
    .populate('membership')
    .lean()
    .exec();

    console.log('Found clients with memberships:', clientsWithMemberships.length);

    // Calculate total revenue safely
    const totalRevenue = clientsWithMemberships.reduce((sum, client) => {
      const membershipCost = client.membership?.cost || 0;
      return sum + membershipCost;
    }, 0);

    console.log('Calculated total revenue:', totalRevenue);

    const stats = {
      totalClients,
      totalTrainers,
      totalMemberships: clientsWithMemberships.length,
      totalRevenue
    };

    console.log('Sending stats response:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics',
      error: error.message 
    });
  }
});

// Stats for trainers
export const getTrainerStats = asyncHandler(async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const trainerId = req.user._id;
    console.log('Fetching trainer stats for:', trainerId);

    // Get trainer's classes
    const trainerClasses = await Class.find({ trainer: trainerId }).exec();
    const classIds = trainerClasses.map(c => c._id);

    // Get bookings stats
    const [upcomingBookings, completedBookings] = await Promise.all([
      Booking.countDocuments({
        class: { $in: classIds },
        date: { $gte: new Date() },
        status: 'confirmed'
      }).exec(),
      Booking.countDocuments({
        class: { $in: classIds },
        date: { $lt: new Date() },
        status: 'confirmed'
      }).exec()
    ]);

    const stats = {
      activeClasses: trainerClasses.length,
      upcomingBookings,
      completedBookings
    };

    console.log('Sending trainer stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error in getTrainerStats:', error);
    res.status(500).json({ 
      message: 'Error fetching trainer statistics',
      error: error.message 
    });
  }
});

// Stats for clients
export const getClientStats = asyncHandler(async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'client') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const clientId = req.user._id;
    console.log('Fetching client stats for:', clientId);

    // Get client's membership info
    const client = await User.findById(clientId)
      .populate('membership')
      .lean()
      .exec();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Get bookings stats
    const [upcomingBookings, completedBookings] = await Promise.all([
      Booking.countDocuments({
        client: clientId,
        date: { $gte: new Date() },
        status: 'confirmed'
      }).exec(),
      Booking.countDocuments({
        client: clientId,
        date: { $lt: new Date() },
        status: 'confirmed'
      }).exec()
    ]);

    // Calculate membership expiry (30 days from now for simplicity)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    const daysLeft = Math.ceil((validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const stats = {
      membershipStatus: client.membership ? {
        name: client.membership.name,
        validUntil: validUntil.toISOString().split('T')[0],
        daysLeft,
        cost: client.membership.cost
      } : null,
      upcomingBookings,
      completedBookings
    };

    console.log('Sending client stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error in getClientStats:', error);
    res.status(500).json({ 
      message: 'Error fetching client statistics',
      error: error.message 
    });
  }
});