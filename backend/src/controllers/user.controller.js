export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean()
      .exec();

    // Transform the data to match the frontend interface
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }));

    res.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
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

    const transformedUser = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    res.status(201).json(transformedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();
    
    const transformedUser = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role
    };

    res.json(transformedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      message: 'Error updating user',
      error: error.message 
    });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Error deleting user',
      error: error.message 
    });
  }
});