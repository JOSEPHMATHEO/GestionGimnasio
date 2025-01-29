import { Class } from '../models/class.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

export const getClasses = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [classes, total] = await Promise.all([
      Class.find()
        .populate({
          path: 'trainer',
          model: User,
          select: 'firstName lastName'
        })
        .skip(skip)
        .limit(limit)
        .lean(),
      Class.countDocuments()
    ]);

    // Transform the data to match the frontend interface
    const transformedClasses = classes.map(classItem => ({
      id: classItem._id.toString(),
      name: classItem.name,
      description: classItem.description,
      trainer: {
        firstName: classItem.trainer?.firstName || '',
        lastName: classItem.trainer?.lastName || ''
      },
      schedule: classItem.schedule,
      capacity: classItem.capacity
    }));
    
    res.json({
      classes: transformedClasses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error in getClasses:', error);
    res.status(500).json({ 
      message: 'Error fetching classes',
      error: error.message 
    });
  }
});

export const getClassById = asyncHandler(async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate({
        path: 'trainer',
        model: User,
        select: 'firstName lastName'
      })
      .lean();
      
    if (!classItem) {
      res.status(404);
      throw new Error('Class not found');
    }
    
    // Transform the data to match the frontend interface
    const transformedClass = {
      id: classItem._id.toString(),
      name: classItem.name,
      description: classItem.description,
      trainer: {
        firstName: classItem.trainer?.firstName || '',
        lastName: classItem.trainer?.lastName || ''
      },
      schedule: classItem.schedule,
      capacity: classItem.capacity
    };
    
    res.json(transformedClass);
  } catch (error) {
    console.error('Error in getClassById:', error);
    res.status(error.status || 500).json({
      message: error.message || 'Error fetching class',
      error: error.message
    });
  }
});

export const createClass = asyncHandler(async (req, res) => {
  try {
    const { name, description, trainer, schedule, capacity } = req.body;
    
    const classItem = await Class.create({
      name,
      description,
      trainer,
      schedule,
      capacity,
    });

    const populatedClass = await Class.findById(classItem._id)
      .populate({
        path: 'trainer',
        model: User,
        select: 'firstName lastName'
      })
      .lean();

    // Transform the data to match the frontend interface
    const transformedClass = {
      id: populatedClass._id.toString(),
      name: populatedClass.name,
      description: populatedClass.description,
      trainer: {
        firstName: populatedClass.trainer?.firstName || '',
        lastName: populatedClass.trainer?.lastName || ''
      },
      schedule: populatedClass.schedule,
      capacity: populatedClass.capacity
    };
    
    res.status(201).json(transformedClass);
  } catch (error) {
    console.error('Error in createClass:', error);
    res.status(500).json({
      message: 'Error creating class',
      error: error.message
    });
  }
});

export const updateClass = asyncHandler(async (req, res) => {
  try {
    const { name, description, trainer, schedule, capacity } = req.body;
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      res.status(404);
      throw new Error('Class not found');
    }

    classItem.name = name || classItem.name;
    classItem.description = description || classItem.description;
    classItem.trainer = trainer || classItem.trainer;
    classItem.schedule = schedule || classItem.schedule;
    classItem.capacity = capacity || classItem.capacity;

    const updatedClass = await classItem.save();
    const populatedClass = await Class.findById(updatedClass._id)
      .populate({
        path: 'trainer',
        model: User,
        select: 'firstName lastName'
      })
      .lean();

    // Transform the data to match the frontend interface
    const transformedClass = {
      id: populatedClass._id.toString(),
      name: populatedClass.name,
      description: populatedClass.description,
      trainer: {
        firstName: populatedClass.trainer?.firstName || '',
        lastName: populatedClass.trainer?.lastName || ''
      },
      schedule: populatedClass.schedule,
      capacity: populatedClass.capacity
    };

    res.json(transformedClass);
  } catch (error) {
    console.error('Error in updateClass:', error);
    res.status(error.status || 500).json({
      message: error.message || 'Error updating class',
      error: error.message
    });
  }
});

export const deleteClass = asyncHandler(async (req, res) => {
  try {
    const classId = req.params.id;

    // Verificar si la clase existe
    const classToDelete = await Class.findById(classId);
    if (!classToDelete) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Verificar si hay reservas para esta clase
    const bookingsExist = await Booking.exists({ class: classId });
    if (bookingsExist) {
      return res.status(400).json({ 
        message: 'Cannot delete class because it has associated bookings. Please remove all bookings first.' 
      });
    }

    // Eliminar la clase
    await classToDelete.deleteOne();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ 
      message: 'Error deleting class',
      error: error.message 
    });
  }
});