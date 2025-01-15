import { Class } from '../models/class.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

export const getClasses = asyncHandler(async (req, res) => {
  try {
    const classes = await Class.find()
      .populate({
        path: 'trainer',
        model: User,
        select: 'firstName lastName'
      })
      .lean();
    
    res.json(classes);
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
    
    res.json(classItem);
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
    
    res.status(201).json(classItem);
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
    res.json(updatedClass);
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
    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      res.status(404);
      throw new Error('Class not found');
    }

    await classItem.deleteOne();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error in deleteClass:', error);
    res.status(error.status || 500).json({
      message: error.message || 'Error deleting class',
      error: error.message
    });
  }
});