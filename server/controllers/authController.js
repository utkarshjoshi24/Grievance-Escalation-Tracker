const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Format user object for API responses
 */
const formatUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  hierarchyLevel: user.hierarchyLevel,
  tierLevel: user.hierarchyLevel,
  rollNumber: user.rollNumber || null,
  title: user.title || null,
  avatar: user.avatar || null,
  createdAt: user.createdAt,
});

/**
 * Generate Signed JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      department: user.department,
      hierarchyLevel: user.hierarchyLevel,
      name: user.name,
    },
    process.env.JWT_SECRET || 'super_secret_jwt_grievance_escalation_tracker_2026_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, hierarchyLevel, rollNumber, title, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR_VALIDATION',
          message: 'Please provide name, email, and password',
        },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR_WEAK_PASSWORD',
          message: 'Password must be at least 6 characters',
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ERR_EMAIL_EXISTS',
          message: 'An account with this email address already exists',
        },
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role || 'student';
    const userHierarchyLevel = userRole === 'authority' ? (Number(hierarchyLevel) || 1) : null;

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: userRole,
      department: department ? department.trim() : null,
      hierarchyLevel: userHierarchyLevel,
      rollNumber: rollNumber ? rollNumber.trim() : null,
      title: title ? title.trim() : null,
      avatar: avatar || null,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: formatUser(user),
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR_MISSING_CREDENTIALS',
          message: 'Please provide an email and password',
        },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ERR_INVALID_CREDENTIALS',
          message: 'Invalid credentials. Please verify your email and password.',
        },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ERR_INVALID_CREDENTIALS',
          message: 'Invalid credentials. Please verify your email and password.',
        },
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: formatUser(user),
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'User record not found' },
      });
    }
    res.status(200).json({
      success: true,
      data: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile in database
// @route   PUT /api/auth/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'User record not found' },
      });
    }

    const { name, department, rollNumber, title, avatar, currentPassword, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (department !== undefined) user.department = department ? department.trim() : null;
    if (rollNumber !== undefined) user.rollNumber = rollNumber ? rollNumber.trim() : null;
    if (title !== undefined) user.title = title ? title.trim() : null;
    if (avatar !== undefined) user.avatar = avatar;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_VALIDATION', message: 'Current password is required to set new password' },
        });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_INVALID_PASSWORD', message: 'Current password does not match' },
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_WEAK_PASSWORD', message: 'Password must be at least 6 characters' },
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: formatUser(user),
      message: 'Profile updated in database successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: get all users from database
// @route   GET /api/auth/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, department, search } = req.query;
    let query = {};

    if (role && role !== 'ALL') query.role = role;
    if (department && department !== 'ALL') query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users.map(formatUser),
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: update any user in database
// @route   PUT /api/auth/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'User not found in database' },
      });
    }

    const { name, email, role, department, hierarchyLevel, rollNumber, title, avatar } = req.body;

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role) {
      user.role = role;
      if (role === 'authority' && !hierarchyLevel && !user.hierarchyLevel) {
        user.hierarchyLevel = 1;
      } else if (role !== 'authority') {
        user.hierarchyLevel = null;
      }
    }
    if (department !== undefined) user.department = department ? department.trim() : null;
    if (hierarchyLevel !== undefined) user.hierarchyLevel = hierarchyLevel ? Number(hierarchyLevel) : null;
    if (rollNumber !== undefined) user.rollNumber = rollNumber ? rollNumber.trim() : null;
    if (title !== undefined) user.title = title ? title.trim() : null;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      data: formatUser(user),
      message: 'User updated in database successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: delete user from database
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERR_FORBIDDEN', message: 'Cannot delete your own account' },
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'User not found in database' },
      });
    }

    res.status(200).json({
      success: true,
      message: 'User removed from database successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (stateless JWT client cleanup confirmation)
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};
