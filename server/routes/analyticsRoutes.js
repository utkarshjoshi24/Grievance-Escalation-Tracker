const express = require('express');
const router = express.Router();
const {
  getOverview,
  getCategoryStats,
  getDepartmentPerformance,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleGuard');

// Analytics accessible to authority and admin
router.get('/analytics/overview', protect, authorize('authority', 'admin'), getOverview);
router.get('/analytics/categories', protect, authorize('authority', 'admin'), getCategoryStats);
router.get('/analytics/departments', protect, authorize('authority', 'admin'), getDepartmentPerformance);

// Admin alias
router.get('/admin/analytics', protect, authorize('admin'), getOverview);

module.exports = router;
