const Grievance = require('../models/Grievance');

// @desc    Get top-level grievance and SLA health metrics
// @route   GET /api/analytics/overview
// @access  Private (Admin, Authority)
exports.getOverview = async (req, res, next) => {
  try {
    const total = await Grievance.countDocuments();
    const pending = await Grievance.countDocuments({ status: 'Pending' });
    const inReview = await Grievance.countDocuments({ status: 'In-Review' });
    const escalated = await Grievance.countDocuments({ status: { $in: ['Escalated', 'Overdue - Top Level'] } });
    const resolved = await Grievance.countDocuments({ status: { $in: ['Resolved', 'Closed'] } });

    const now = new Date();
    const activeBreached = await Grievance.countDocuments({
      status: { $in: ['Pending', 'In-Review', 'Escalated'] },
      slaDeadline: { $lt: now },
    });

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        inReview,
        escalated,
        resolved,
        activeBreached,
        resolutionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get breakdown by category
// @route   GET /api/analytics/categories
// @access  Private (Admin, Authority)
exports.getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Grievance.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          escalated: {
            $sum: { $cond: [{ $in: ['$status', ['Escalated', 'Overdue - Top Level']] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats.map((s) => ({
        category: s._id,
        total: s.total,
        resolved: s.resolved,
        pending: s.pending,
        escalated: s.escalated,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get department resolution performance
// @route   GET /api/analytics/departments
// @access  Private (Admin, Authority)
exports.getDepartmentPerformance = async (req, res, next) => {
  try {
    const stats = await Grievance.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats.map((s) => ({
        department: s._id || 'General',
        total: s.total,
        resolved: s.resolved,
        rate: s.total > 0 ? Math.round((s.resolved / s.total) * 100) : 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};
