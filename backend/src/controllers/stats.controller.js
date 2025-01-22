import { User } from '../models/user.model.js';
import { Class } from '../models/class.model.js';
import { Booking } from '../models/booking.model.js';
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

    console.log('Fetching stats for user:', req.user._id, 'role:', req.user.role);

    // Get counts with proper error handling
    const [totalClients, totalTrainers, clientsWithMemberships] = await Promise.all([
      User.countDocuments({ role: 'client' }).exec(),
      User.countDocuments({ role: 'trainer' }).exec(),
      User.find({
        role: 'client',
        membership: { $exists: true, $ne: null }
      })
      .populate({
        path: 'membership',
        select: 'cost'
      })
      .lean()
      .exec()
    ]);

    console.log('Stats counts:', { totalClients, totalTrainers, membershipsCount: clientsWithMemberships.length });

    // Calculate total revenue safely
    const totalRevenue = clientsWithMemberships.reduce((sum, client) => {
      if (!client.membership || typeof client.membership.cost !== 'number') {
        console.log('Invalid membership data for client:', client._id);
        return sum;
      }
      return sum + client.membership.cost;
    }, 0);

    console.log('Total revenue calculated:', totalRevenue);

    const response = {
      totalClients,
      totalTrainers,
      totalMemberships: clientsWithMemberships.length,
      totalRevenue
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics',
      error: error.message 
    });
  }
});

// Stats for trainers
export const getTrainerStats = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const trainerId = req.user._id;
    console.log('Fetching trainer stats for:', trainerId);

    // Get trainer's classes
    const trainerClasses = await Class.find({ trainer: trainerId }).exec();
    const classIds = trainerClasses.map(c => c._id);

    console.log('Found classes for trainer:', classIds.length);

    // Get booking counts
    const [activeClasses, upcomingBookings, completedBookings] = await Promise.all([
      Class.countDocuments({ trainer: trainerId }).exec(),
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

    const response = {
      activeClasses,
      upcomingBookings,
      completedBookings
    };

    console.log('Sending trainer stats:', response);
    res.json(response);
  } catch (error) {
    console.error('Error getting trainer stats:', error);
    res.status(500).json({ 
      message: 'Error fetching trainer statistics',
      error: error.message 
    });
  }
});

// Stats for clients
export const getClientStats = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const clientId = req.user._id;
    console.log('Fetching client stats for:', clientId);

    // Get client with membership
    const client = await User.findById(clientId)
      .populate({
        path: 'membership',
        select: 'name cost'
      })
      .lean()
      .exec();

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    console.log('Found client:', client._id, 'with membership:', client.membership?._id);

    // Get booking counts
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

    // Calculate membership expiry (mock data for now)
    const mockExpiryDate = new Date();
    mockExpiryDate.setDate(mockExpiryDate.getDate() + 30);

    const response = {
      membershipStatus: client.membership ? {
        name: client.membership.name || 'Standard Membership',
        validUntil: mockExpiryDate.toISOString().split('T')[0],
        daysLeft: 30,
        cost: client.membership.cost || 0
      } : null,
      upcomingBookings,
      completedBookings
    };

    console.log('Sending client stats:', response);
    res.json(response);
  } catch (error) {
    console.error('Error getting client stats:', error);
    res.status(500).json({ 
      message: 'Error fetching client statistics',
      error: error.message 
    });
  }
});