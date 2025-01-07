import mongoose from 'mongoose';
import { Booking } from '../models/booking.model.js';
import { Class } from '../models/class.model.js';

export const createBooking = async (req, res) => {
  try {
    const { classId, date } = req.body;
    const clientId = req.user.id;

    if (!classId || !date) {
      return res.status(400).json({ 
        message: 'Class and date are required' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        message: 'Invalid class ID format'
      });
    }

    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ 
        message: 'Class not found' 
      });
    }

    const booking = await Booking.create({
      class: classId,
      client: clientId,
      date: new Date(date),
      status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('class', 'name schedule')
      .populate('client', 'firstName lastName');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('class', 'name schedule')
      .populate('client', 'firstName lastName');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('class', 'name schedule')
      .populate('client', 'firstName lastName');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status || booking.status;
    const updatedBooking = await booking.save();
    
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('class', 'name schedule')
      .populate('client', 'firstName lastName');
      
    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking' });
  }
};