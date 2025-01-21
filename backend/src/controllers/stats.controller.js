import { User } from '../models/user.model.js';
import { Class } from '../models/class.model.js';
import { Booking } from '../models/booking.model.js';
import asyncHandler from 'express-async-handler';

// General stats for admin and manager
export const getStats = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching general stats...');
    
    // Fetch all clients with memberships in a single query
    const clientsWithMemberships = await User.aggregate([
      { 
        $match: { 
          role: 'client',
          membership: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: 'memberships',
          localField: 'membership',
          foreignField: '_id',
          as: 'membershipDetails'
        }
      },
      {
        $unwind: '$membershipDetails'
      }
    ]);

    // Count totals
    const [totalClients, totalTrainers] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'trainer' })
    ]);

    // Calculate total revenue
    const totalRevenue = clientsWithMemberships.reduce((sum, client) => {
      return sum + (client.membershipDetails?.cost || 0);
    }, 0);

    console.log('Stats calculated:', {
      totalClients,
      totalTrainers,
      totalMemberships: clientsWithMemberships.length,
      totalRevenue
    });

    res.json({
      totalClients,
      totalTrainers,
      totalMemberships: clientsWithMemberships.length,
      totalRevenue
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Stats for trainers
export const getTrainerStats = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching trainer stats for:', req.user._id);
    
    const trainerId = req.user._id;

    // Get trainer's classes
    const trainerClasses = await Class.find({ trainer: trainerId });
    const classIds = trainerClasses.map(c => c._id);

    // Get current date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeClasses, upcomingBookings, completedBookings] = await Promise.all([
      Class.countDocuments({ trainer: trainerId }),
      Booking.countDocuments({
        class: { $in: classIds },
        date: { $gte: today },
        status: 'confirmed'
      }),
      Booking.countDocuments({
        class: { $in: classIds },
        date: { $lt: today },
        status: 'confirmed'
      })
    ]);

    console.log('Trainer stats calculated:', {
      activeClasses,
      upcomingBookings,
      completedBookings
    });

    res.json({
      activeClasses,
      upcomingBookings,
      completedBookings
    });
  } catch (error) {
    console.error('Error getting trainer stats:', error);
    res.status(500).json({ 
      message: 'Error fetching trainer statistics',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Stats for clients
export const getClientStats = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching client stats for:', req.user._id);
    
    const clientId = req.user._id;

    // Get current date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [client, upcomingBookings, completedBookings] = await Promise.all([
      User.findById(clientId).populate('membership', 'name cost'),
      Booking.countDocuments({
        client: clientId,
        date: { $gte: today },
        status: 'confirmed'
      }),
      Booking.countDocuments({
        client: clientId,
        date: { $lt: today },
        status: 'confirmed'
      })
    ]);

    if (!client) {
      console.log('Client not found:', clientId);
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate membership expiry (mock data for now)
    const mockExpiryDate = new Date();
    mockExpiryDate.setDate(mockExpiryDate.getDate() + 30);

    const stats = {
      membershipStatus: client.membership ? {
        name: client.membership.name,
        validUntil: mockExpiryDate.toISOString().split('T')[0],
        daysLeft: 30
      } : null,
      upcomingBookings,
      completedBookings
    };

    console.log('Client stats calculated:', stats);

    res.json(stats);
  } catch (error) {
    console.error('Error getting client stats:', error);
    res.status(500).json({ 
      message: 'Error fetching client statistics',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});