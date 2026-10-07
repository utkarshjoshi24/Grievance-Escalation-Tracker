const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleGuard');

// Public authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Authenticated user profile routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/profile', protect, updateProfile);

// Admin-only user management in database
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
