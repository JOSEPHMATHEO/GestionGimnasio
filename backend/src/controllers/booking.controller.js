import { Booking } from '../models/booking.model.js';
import { Class } from '../models/class.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

export const getBookings = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'trainer') {
      // Get classes where the trainer is the current user
      const trainerClasses = await Class.find({ trainer: req.user._id }).select('_id');
      const classIds = trainerClasses.map(c => c._id);
      query.class = { $in: classIds };
    }

    console.log('User role:', req.user.role);
    console.log('Query:', JSON.stringify(query));

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate({
          path: 'class',
          model: Class,
          select: 'name schedule trainer',
          populate: {
            path: 'trainer',
            model: User,
            select: 'firstName lastName'
          }
        })
        .populate({
          path: 'client',
          model: User,
          select: 'firstName lastName'
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Booking.countDocuments(query)
    ]);

    console.log('Found bookings:', bookings.length);

    // Transform bookings to match frontend interface
    const transformedBookings = bookings.map(booking => {
      try {
        return {
          id: booking._id.toString(),
          class: {
            id: booking.class?._id?.toString(),
            name: booking.class?.name || 'Unknown Class',
            schedule: booking.class?.schedule || {},
            trainer: booking.class?.trainer ? {
              firstName: booking.class.trainer.firstName || '',
              lastName: booking.class.trainer.lastName || ''
            } : { firstName: '', lastName: '' }
          },
          client: {
            id: booking.client?._id?.toString(),
            firstName: booking.client?.firstName || '',
            lastName: booking.client?.lastName || ''
          },
          date: booking.date,
          status: booking.status,
          createdAt: booking.createdAt
        };
      } catch (err) {
        console.error('Error transforming booking:', err);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from failed transformations

    res.json({
      bookings: transformedBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error in getBookings:', error);
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export const getBookingById = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'class',
        model: Class,
        select: 'name schedule',
        populate: {
          path: 'trainer',
          model: User,
          select: 'firstName lastName'
        }
      })
      .populate({
        path: 'client',
        model: User,
        select: 'firstName lastName'
      })
      .lean();

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'client' && booking.client._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    const transformedBooking = {
      id: booking._id.toString(),
      class: {
        id: booking.class._id.toString(),
        name: booking.class.name,
        schedule: booking.class.schedule,
        trainer: {
          firstName: booking.class.trainer.firstName,
          lastName: booking.class.trainer.lastName
        }
      },
      client: {
        id: booking.client._id.toString(),
        firstName: booking.client.firstName,
        lastName: booking.client.lastName
      },
      date: booking.date,
      status: booking.status,
      createdAt: booking.createdAt
    };

    res.json(transformedBooking);
  } catch (error) {
    console.error('Error in getBookingById:', error);
    res.status(500).json({ 
      message: 'Error fetching booking',
      error: error.message 
    });
  }
});

export const createBooking = asyncHandler(async (req, res) => {
  try {
    const { classId, date } = req.body;
    const clientId = req.user.id;

    // Verify class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(400).json({ message: 'Class not found' });
    }

    // Check if user already has a booking for this class on this date
    const existingBooking = await Booking.findOne({
      class: classId,
      client: clientId,
      date: date,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this class on this date' });
    }

    const booking = await Booking.create({
      class: classId,
      client: clientId,
      date,
      status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'class',
        model: Class,
        select: 'name schedule',
        populate: {
          path: 'trainer',
          model: User,
          select: 'firstName lastName'
        }
      })
      .populate({
        path: 'client',
        model: User,
        select: 'firstName lastName'
      })
      .lean();

    const transformedBooking = {
      id: populatedBooking._id.toString(),
      class: {
        id: populatedBooking.class._id.toString(),
        name: populatedBooking.class.name,
        schedule: populatedBooking.class.schedule,
        trainer: {
          firstName: populatedBooking.class.trainer.firstName,
          lastName: populatedBooking.class.trainer.lastName
        }
      },
      client: {
        id: populatedBooking.client._id.toString(),
        firstName: populatedBooking.client.firstName,
        lastName: populatedBooking.client.lastName
      },
      date: populatedBooking.date,
      status: populatedBooking.status,
      createdAt: populatedBooking.createdAt
    };

    res.status(201).json(transformedBooking);
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

export const updateBooking = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'client' && booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status || booking.status;
    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate({
        path: 'class',
        model: Class,
        select: 'name schedule',
        populate: {
          path: 'trainer',
          model: User,
          select: 'firstName lastName'
        }
      })
      .populate({
        path: 'client',
        model: User,
        select: 'firstName lastName'
      })
      .lean();

    const transformedBooking = {
      id: populatedBooking._id.toString(),
      class: {
        id: populatedBooking.class._id.toString(),
        name: populatedBooking.class.name,
        schedule: populatedBooking.class.schedule,
        trainer: {
          firstName: populatedBooking.class.trainer.firstName,
          lastName: populatedBooking.class.trainer.lastName
        }
      },
      client: {
        id: populatedBooking.client._id.toString(),
        firstName: populatedBooking.client.firstName,
        lastName: populatedBooking.client.lastName
      },
      date: populatedBooking.date,
      status: populatedBooking.status,
      createdAt: populatedBooking.createdAt
    };

    res.json(transformedBooking);
  } catch (error) {
    console.error('Error in updateBooking:', error);
    res.status(500).json({ 
      message: 'Error updating booking',
      error: error.message 
    });
  }
});

export const deleteBooking = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'client' && booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBooking:', error);
    res.status(500).json({ 
      message: 'Error deleting booking',
      error: error.message 
    });
  }
});