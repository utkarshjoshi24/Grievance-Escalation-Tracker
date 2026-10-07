const express = require('express');
const router = express.Router();
const {
  submitGrievance,
  trackByToken,
  getStudentGrievances,
  getStudentGrievanceById,
  getAssignedGrievances,
  getAuthorityGrievanceById,
  updateStatus,
  escalateManual,
  getAllGrievances,
  overrideGrievance,
} = require('../controllers/grievanceController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleGuard');

// Public / Submission routes
router.post('/grievances', optionalAuth, submitGrievance);
router.get('/grievances/track/:token', trackByToken);

// Student routes
router.get('/student/grievances', protect, authorize('student', 'admin'), getStudentGrievances);
router.get('/student/grievances/:id', protect, authorize('student', 'admin'), getStudentGrievanceById);
// API spec alias
router.get('/grievances/my', protect, authorize('student', 'admin'), getStudentGrievances);

// Authority triage & action routes
router.get('/authority/grievances', protect, authorize('authority', 'admin'), getAssignedGrievances);
router.get('/authority/grievances/:id', protect, authorize('authority', 'admin'), getAuthorityGrievanceById);
router.patch('/authority/grievances/:id/status', protect, authorize('authority', 'admin'), updateStatus);
router.post('/authority/grievances/:id/escalate', protect, authorize('authority', 'admin'), escalateManual);

// API spec aliases for authority actions
router.get('/grievances/assigned', protect, authorize('authority', 'admin'), getAssignedGrievances);
router.patch('/grievances/:id/status', protect, authorize('authority', 'admin'), updateStatus);
router.patch('/grievances/:id/escalate', protect, authorize('authority', 'admin'), escalateManual);
router.post('/grievances/:id/escalate', protect, authorize('authority', 'admin'), escalateManual);

// Admin routes
router.get('/admin/grievances', protect, authorize('admin'), getAllGrievances);
router.get('/admin/grievances/:id', protect, authorize('admin'), getAuthorityGrievanceById);
router.patch('/admin/grievances/:id/override', protect, authorize('admin'), overrideGrievance);

module.exports = router;
