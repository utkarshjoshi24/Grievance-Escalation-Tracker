const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const formatted = notifications.map((n) => ({
      id: n._id.toString(),
      _id: n._id.toString(),
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type,
      grievanceToken: n.grievanceToken,
      isRead: n.isRead,
      createdAt: n.createdAt,
      timestamp: n.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
      unreadCount: formatted.filter((n) => !n.isRead).length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const cleanId = req.params.id ? req.params.id.toString().trim() : '';
    const isObjId = mongoose.Types.ObjectId.isValid(cleanId) && /^[0-9a-fA-F]{24}$/.test(cleanId);

    const query = isObjId
      ? { _id: cleanId, userId: req.user._id }
      : { grievanceToken: cleanId, userId: req.user._id };

    const notification = await Notification.findOneAndUpdate(
      query,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'Notification not found' },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: notification._id.toString(),
        _id: notification._id.toString(),
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        grievanceToken: notification.grievanceToken,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        timestamp: notification.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read in database',
    });
  } catch (error) {
    next(error);
  }
};
