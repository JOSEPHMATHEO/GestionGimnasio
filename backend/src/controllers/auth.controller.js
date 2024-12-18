import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'client',
    });

    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};