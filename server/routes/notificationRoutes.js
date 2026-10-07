const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/notifications', protect, getUserNotifications);
router.patch('/notifications/:id/read', protect, markAsRead);
router.patch('/notifications/read-all', protect, markAllAsRead);

module.exports = router;
