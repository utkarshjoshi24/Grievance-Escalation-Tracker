const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'ERR_UNAUTHORIZED',
        message: 'Access denied. No authentication token provided.',
      },
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_grievance_escalation_tracker_2026_key'
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ERR_USER_NOT_FOUND',
          message: 'The user belonging to this token no longer exists.',
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'ERR_INVALID_TOKEN',
        message: error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token signature',
      },
    });
  }
};

// Optional auth middleware (for routes where user can be anonymous or logged in)
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_grievance_escalation_tracker_2026_key'
    );
    const user = await User.findById(decoded.userId);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }

  next();
};

module.exports = { protect, optionalAuth };
