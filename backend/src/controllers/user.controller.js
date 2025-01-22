import { User } from '../models/user.model.js';
import { Membership } from '../models/membership.model.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const roleFilter = req.query.role || '';

    console.log('Fetching users with params:', { page, limit, skip, search, roleFilter });

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (roleFilter) {
      query.role = roleFilter;
    }

    // Get total count first
    const total = await User.countDocuments(query);

    // Then get paginated users
    const users = await User.find(query)
      .select('-password')
      .populate('membership', 'name cost')
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform the data to match the frontend interface
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      membershipId: user.membership?._id?.toString(),
      membership: user.membership ? {
        name: user.membership.name,
        cost: user.membership.cost
      } : null
    }));

    console.log(`Found ${transformedUsers.length} users`);

    // Send response with pagination
    res.json({
      users: transformedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ 
      message: 'Error fetching users',
      error: error.message 
    });
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .lean()
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transformedUser = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    res.json(transformedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

export const createUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, membershipId } = req.body;

    console.log('Creating user with data:', { 
      firstName, 
      lastName, 
      email, 
      role, 
      membershipId 
    });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'trainer', 'client'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Validate membership for clients
    if (role === 'client') {
      if (!membershipId) {
        return res.status(400).json({ message: 'Membership is required for clients' });
      }

      // Verify membership exists
      const membershipExists = await Membership.findById(membershipId);
      if (!membershipExists) {
        return res.status(400).json({ message: 'Invalid membership selected' });
      }
    }

    // Create user data object
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      ...(role === 'client' && { membership: membershipId })
    };

    console.log('Creating user with userData:', userData);

    // Create user
    const user = await User.create(userData);

    // Return user without password
    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('membership', 'name cost')
      .lean();

    console.log('User created successfully:', userResponse);

    res.status(201).json({
      user: {
        id: userResponse._id.toString(),
        firstName: userResponse.firstName,
        lastName: userResponse.lastName,
        email: userResponse.email,
        role: userResponse.role,
        membershipId: userResponse.membership?._id?.toString(),
        membership: userResponse.membership ? {
          name: userResponse.membership.name,
          cost: userResponse.membership.cost
        } : null
      }
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message || 'Unknown error occurred'
    });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, membershipId, password } = req.body;

    console.log('Updating user:', { id, firstName, lastName, email, role, membershipId });

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate email uniqueness if it's being changed
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update basic fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.role = role;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle membership
    if (role === 'client') {
      if (membershipId) {
        const membershipExists = await Membership.findById(membershipId);
        if (!membershipExists) {
          return res.status(400).json({ message: 'Invalid membership selected' });
        }
        user.membership = membershipId;
      }
    } else {
      user.membership = undefined;
    }

    const updatedUser = await user.save();
    console.log('User updated successfully:', updatedUser._id);

    const populatedUser = await User.findById(updatedUser._id)
      .select('-password')
      .populate('membership', 'name cost')
      .lean();

    res.json({
      user: {
        id: populatedUser._id.toString(),
        firstName: populatedUser.firstName,
        lastName: populatedUser.lastName,
        email: populatedUser.email,
        role: populatedUser.role,
        membershipId: populatedUser.membership?._id?.toString(),
        membership: populatedUser.membership ? {
          name: populatedUser.membership.name,
          cost: populatedUser.membership.cost
        } : null
      }
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ 
      message: 'Error updating user',
      error: error.message 
    });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Attempting to delete user with ID:', id);

    const user = await User.findById(id);
    
    if (!user) {
      console.log('User not found with ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    console.log('User deleted successfully:', id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ 
      message: 'Error deleting user',
      error: error.message 
    });
  }
});