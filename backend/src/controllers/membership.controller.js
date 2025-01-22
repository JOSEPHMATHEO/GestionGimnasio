import { Membership } from '../models/membership.model.js';

export const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().select('name description cost');
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ message: 'Error fetching memberships' });
  }
};

export const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    res.json(membership);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ message: 'Error fetching membership' });
  }
};

export const createMembership = async (req, res) => {
  try {
    const { name, description, cost } = req.body;
    
    // Verificar si ya existe una membresía con el mismo nombre
    const existingMembership = await Membership.findOne({ name });
    if (existingMembership) {
      return res.status(400).json({ message: 'A membership with this name already exists' });
    }

    const membership = await Membership.create({
      name,
      description,
      cost,
    });
    res.status(201).json(membership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ message: 'Error creating membership' });
  }
};

export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cost } = req.body;

    // Verificar si existe la membresía
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Verificar si el nuevo nombre ya existe (excluyendo la membresía actual)
    if (name !== membership.name) {
      const existingMembership = await Membership.findOne({ 
        name, 
        _id: { $ne: id } 
      });
      if (existingMembership) {
        return res.status(400).json({ message: 'A membership with this name already exists' });
      }
    }

    // Actualizar los campos
    membership.name = name;
    membership.description = description;
    membership.cost = cost;

    const updatedMembership = await membership.save();
    res.json(updatedMembership);
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ message: 'Error updating membership' });
  }
};

export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si existe la membresía
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Verificar si hay usuarios usando esta membresía
    const User = (await import('../models/user.model.js')).User;
    const usersWithMembership = await User.countDocuments({ membership: id });
    
    if (usersWithMembership > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete membership because it is being used by users. Please reassign users first.' 
      });
    }

    await membership.deleteOne();
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ message: 'Error deleting membership' });
  }
};