import { Class } from '../models/class.model.js';
import { User } from '../models/user.model.js';

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('trainer', 'firstName lastName');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('trainer', 'firstName lastName');
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class' });
  }
};

export const createClass = async (req, res) => {
  try {
    const { name, description, trainer, schedule, capacity } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!name || !description || !trainer || !schedule || !capacity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validar que el `trainer` sea un usuario con el rol `trainer`
    const trainerUser = await User.findById(trainer);
    if (!trainerUser) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    if (trainerUser.role !== 'trainer') {
      return res.status(400).json({ message: 'User is not a trainer' });
    }

    // Crear la clase
    const classItem = await Class.create({
      name,
      description,
      trainer,
      schedule,
      capacity,
    });

    res.status(201).json(classItem);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { name, description, trainer, schedule, capacity } = req.body;
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    classItem.name = name || classItem.name;
    classItem.description = description || classItem.description;
    classItem.trainer = trainer || classItem.trainer;
    classItem.schedule = schedule || classItem.schedule;
    classItem.capacity = capacity || classItem.capacity;

    const updatedClass = await classItem.save();
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error updating class' });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classItem.deleteOne();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class' });
  }
};