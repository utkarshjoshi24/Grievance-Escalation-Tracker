const express = require('express');
const router = express.Router();
const {
  getAllHierarchyConfigs,
  getCategoryHierarchy,
  updateCategoryHierarchy,
} = require('../controllers/hierarchyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleGuard');

// Public or authenticated reading
router.get('/hierarchy', getAllHierarchyConfigs);
router.get('/hierarchy/:category', getCategoryHierarchy);

// Admin alias routes
router.get('/admin/hierarchy', protect, authorize('admin'), getAllHierarchyConfigs);
router.get('/admin/hierarchy/:category', protect, authorize('admin'), getCategoryHierarchy);

// Admin-only updates to hierarchy SLAs and tiers
router.put('/hierarchy/:category', protect, authorize('admin'), updateCategoryHierarchy);
router.put('/admin/hierarchy/:category', protect, authorize('admin'), updateCategoryHierarchy);

module.exports = router;
