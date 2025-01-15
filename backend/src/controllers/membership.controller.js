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
    res.status(500).json({ message: 'Error fetching membership' });
  }
};

export const createMembership = async (req, res) => {
  try {
    const { name, description, cost } = req.body;
    const membership = await Membership.create({
      name,
      description,
      cost,
    });
    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Error creating membership' });
  }
};

export const updateMembership = async (req, res) => {
  try {
    const { name, description, cost } = req.body;
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    membership.name = name || membership.name;
    membership.description = description || membership.description;
    membership.cost = cost || membership.cost;

    const updatedMembership = await membership.save();
    res.json(updatedMembership);
  } catch (error) {
    res.status(500).json({ message: 'Error updating membership' });
  }
};

export const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    await membership.deleteOne();
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting membership' });
  }
};