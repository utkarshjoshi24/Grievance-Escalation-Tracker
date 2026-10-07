const mongoose = require('mongoose');
const Grievance = require('../models/Grievance');
const HierarchyConfig = require('../models/HierarchyConfig');
const EscalationLog = require('../models/EscalationLog');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { hashIdentifier } = require('../utils/hashUtil');
const { generateTrackingToken } = require('../utils/tokenGenerator');

/**
 * Safely find a grievance by ObjectId OR trackingToken
 */
const findGrievanceByIdOrToken = async (identifier, populateComplainant = false) => {
  if (!identifier) return null;
  const clean = identifier.toString().trim();
  const isObjId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);

  const query = isObjId
    ? { $or: [{ _id: clean }, { trackingToken: clean.toUpperCase() }, { trackingToken: clean }] }
    : { $or: [{ trackingToken: clean.toUpperCase() }, { trackingToken: clean }] };

  let req = Grievance.findOne(query);
  if (populateComplainant) {
    req = req.populate('complainantId', 'name email rollNumber department');
  }
  return req;
};

/**
 * Format grievance document into consistent client-friendly representation
 */
const formatGrievance = (g, currentAuthorityTitle = null) => {
  const obj = g.toObject ? g.toObject() : { ...g };
  const token = obj.trackingToken || obj.token;

  return {
    ...obj,
    id: obj._id ? obj._id.toString() : obj.id,
    _id: obj._id ? obj._id.toString() : obj.id,
    token,
    trackingToken: token,
    trackingUuid: token,
    currentAuthorityTitle: currentAuthorityTitle || `Tier ${obj.currentLevel} Authority`,
    currentAuthorityDisplay: currentAuthorityTitle || `Tier ${obj.currentLevel} Authority`,
  };
};

// @desc    Submit a new grievance (identified or anonymous)
// @route   POST /api/grievances
// @access  Public / Optional Auth
exports.submitGrievance = async (req, res, next) => {
  try {
    const {
      title,
      category,
      department,
      priority,
      description,
      isAnonymous,
      attachments,
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR_VALIDATION',
          message: 'Title, category, and description are required.',
        },
      });
    }

    // Determine submitter hash for anti-spam rate limiting & anonymous linking
    let identifierToHash = req.user ? req.user._id.toString() : (req.ip || 'anonymous_submitter');
    const submittedByHash = hashIdentifier(identifierToHash);

    // Look up category SLA hierarchy
    let hierarchy = await HierarchyConfig.findOne({ category });
    if (!hierarchy) {
      hierarchy = await HierarchyConfig.findOne({ category: 'Academic' });
    }

    const level1Config = hierarchy?.levels?.find((l) => l.levelNumber === 1) || {
      roleTitle: 'Department Officer',
      slaHours: 24,
    };

    const now = new Date();
    const slaDeadline = new Date(now.getTime() + (level1Config.slaHours || 24) * 3600 * 1000);
    const trackingToken = generateTrackingToken();

    const grievance = await Grievance.create({
      trackingToken,
      title: title.trim(),
      category,
      department: department || 'General',
      priority: priority || 'MEDIUM',
      description: description.trim(),
      isAnonymous: Boolean(isAnonymous),
      complainantId: isAnonymous ? null : (req.user ? req.user._id : null),
      submittedByHash,
      currentLevel: 1,
      status: 'Pending',
      slaDeadline,
      slaHoursTotal: level1Config.slaHours || 24,
      attachments: attachments || [],
    });

    // Record initial creation log
    await EscalationLog.create({
      grievanceId: grievance._id,
      fromLevel: 1,
      toLevel: 1,
      reason: isAnonymous
        ? 'Registered securely with Zero-Knowledge encryption shield. Student identity withheld.'
        : `Logged by student (${req.user?.name || 'Complainant'}). Assigned tracking token ${trackingToken}.`,
      escalatedBy: req.user ? req.user._id : null,
      timestamp: now,
    });

    // Notification for logged-in complainant
    if (req.user && !isAnonymous) {
      await Notification.create({
        userId: req.user._id,
        title: 'Grievance Registered Successfully',
        message: `Your grievance "${title}" has been registered with Token ${trackingToken}.`,
        type: 'SUBMISSION',
        grievanceToken: trackingToken,
      });
    }

    // NOTIFY ASSIGNED AUTHORITIES (Tier 1 authorities matching department or general)
    try {
      const authDeptRegex = new RegExp(`^${grievance.department}$`, 'i');
      const authorities = await User.find({
        role: 'authority',
        hierarchyLevel: 1,
        $or: [
          { department: authDeptRegex },
          { department: 'General' },
          { department: 'Institutional General' },
          { department: null },
        ],
      });

      for (const authUser of authorities) {
        await Notification.create({
          userId: authUser._id,
          title: `New Grievance Assigned: Tier 1`,
          message: `Grievance "${title}" (${trackingToken}) assigned to your department queue.`,
          type: 'SUBMISSION',
          grievanceToken: trackingToken,
        });
      }
    } catch (notifErr) {
      console.warn('[Notification Warning] Could not notify Tier 1 authorities:', notifErr.message);
    }

    const formatted = formatGrievance(grievance, level1Config.roleTitle);

    res.status(201).json({
      success: true,
      data: formatted,
      message: 'Grievance registered successfully in database',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track grievance by public token with strict privacy filter
// @route   GET /api/grievances/track/:token
// @access  Public
exports.trackByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const grievance = await findGrievanceByIdOrToken(token, true);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ERR_NOT_FOUND',
          message: `No grievance found with tracking token "${token}".`,
        },
      });
    }

    // Fetch category hierarchy to resolve generic role title
    const hierarchy = await HierarchyConfig.findOne({ category: grievance.category });
    const currentTierConfig = hierarchy?.levels?.find((l) => l.levelNumber === grievance.currentLevel);

    // Fetch timeline logs
    const logs = await EscalationLog.find({ grievanceId: grievance._id }).sort({ timestamp: 1 });

    const timeline = logs.map((log) => ({
      id: log._id,
      title: log.fromLevel === log.toLevel ? 'Grievance Submitted' : `Escalated to Tier ${log.toLevel}`,
      description: log.reason,
      actorRole: 'System SLA Engine',
      timestamp: log.timestamp,
    }));

    const publicGrievance = {
      id: grievance._id.toString(),
      _id: grievance._id.toString(),
      token: grievance.trackingToken,
      trackingToken: grievance.trackingToken,
      trackingUuid: grievance.trackingToken,
      title: grievance.title,
      category: grievance.category,
      department: grievance.department,
      priority: grievance.priority,
      description: grievance.description,
      status: grievance.status,
      currentLevel: grievance.currentLevel,
      currentAuthorityDisplay: currentTierConfig ? currentTierConfig.roleTitle : `Tier ${grievance.currentLevel} Authority`,
      currentAuthorityTitle: currentTierConfig ? currentTierConfig.roleTitle : `Tier ${grievance.currentLevel} Authority`,
      slaDeadline: grievance.slaDeadline,
      slaHoursTotal: grievance.slaHoursTotal,
      resolutionRemarks: grievance.resolutionRemarks,
      resolutionNotes: grievance.resolutionRemarks,
      resolvedAt: grievance.resolvedAt,
      createdAt: grievance.createdAt,
      timeline,
      isAnonymous: grievance.isAnonymous,
      complainantName: grievance.isAnonymous
        ? 'Protected (Anonymous)'
        : (grievance.complainantId?.name || 'Student Complainant'),
      complainantEmail: grievance.isAnonymous ? null : grievance.complainantId?.email,
    };

    res.status(200).json({
      success: true,
      data: publicGrievance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's grievances
// @route   GET /api/student/grievances
// @access  Private (Student)
exports.getStudentGrievances = async (req, res, next) => {
  try {
    const grievances = await Grievance.find({
      $or: [
        { complainantId: req.user._id },
        { submittedByHash: hashIdentifier(req.user._id.toString()) },
      ],
    }).sort({ createdAt: -1 });

    const formatted = grievances.map((g) => formatGrievance(g));

    res.status(200).json({
      success: true,
      data: formatted,
      count: formatted.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student grievance with timeline
// @route   GET /api/student/grievances/:id
// @access  Private (Student)
exports.getStudentGrievanceById = async (req, res, next) => {
  try {
    const grievance = await findGrievanceByIdOrToken(req.params.id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'Grievance record not found' },
      });
    }

    const logs = await EscalationLog.find({ grievanceId: grievance._id }).sort({ timestamp: 1 });
    const hierarchy = await HierarchyConfig.findOne({ category: grievance.category });
    const tierConfig = hierarchy?.levels?.find((l) => l.levelNumber === grievance.currentLevel);

    const formatted = {
      ...formatGrievance(grievance, tierConfig?.roleTitle),
      timeline: logs.map((log) => ({
        id: log._id,
        title: log.fromLevel === log.toLevel ? 'Status Update' : `Tier ${log.toLevel} Escalation`,
        description: log.reason,
        timestamp: log.timestamp,
      })),
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get authority triage queue
// @route   GET /api/authority/grievances
// @access  Private (Authority)
exports.getAssignedGrievances = async (req, res, next) => {
  try {
    const authorityLevel = req.user.hierarchyLevel || 1;
    const authorityDept = req.user.department;

    let query = {
      currentLevel: authorityLevel,
    };

    if (authorityDept && authorityDept !== 'Institutional General' && authorityDept !== 'General') {
      const deptRegex = new RegExp(`^${authorityDept}$`, 'i');
      query.$or = [{ department: deptRegex }, { department: 'General' }, { department: 'Institutional General' }, { department: null }];
    }

    if (req.query.status && req.query.status !== 'ALL') {
      query.status = req.query.status;
    }

    if (req.query.category && req.query.category !== 'ALL') {
      query.category = req.query.category;
    }

    const grievances = await Grievance.find(query)
      .sort({ slaDeadline: 1, createdAt: -1 })
      .populate('complainantId', 'name email rollNumber');

    // Hide complainant personal details if isAnonymous is true
    const sanitized = grievances.map((g) => {
      const obj = formatGrievance(g);
      if (obj.isAnonymous) {
        delete obj.complainantId;
        obj.complainantName = 'Protected (Anonymous)';
        obj.complainantEmail = null;
      } else if (g.complainantId) {
        obj.complainantName = g.complainantId.name;
        obj.complainantEmail = g.complainantId.email;
        obj.complainantRollNumber = g.complainantId.rollNumber;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      data: sanitized,
      count: sanitized.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get authority grievance detail
// @route   GET /api/authority/grievances/:id
// @access  Private (Authority)
exports.getAuthorityGrievanceById = async (req, res, next) => {
  try {
    const grievance = await findGrievanceByIdOrToken(req.params.id, true);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'Grievance record not found' },
      });
    }

    const logs = await EscalationLog.find({ grievanceId: grievance._id }).sort({ timestamp: 1 });
    const hierarchy = await HierarchyConfig.findOne({ category: grievance.category });
    const tierConfig = hierarchy?.levels?.find((l) => l.levelNumber === grievance.currentLevel);

    const obj = formatGrievance(grievance, tierConfig?.roleTitle);
    if (obj.isAnonymous) {
      delete obj.complainantId;
      obj.complainantName = 'Protected (Anonymous)';
      obj.complainantEmail = null;
    } else if (grievance.complainantId) {
      obj.complainantName = grievance.complainantId.name;
      obj.complainantEmail = grievance.complainantId.email;
      obj.complainantRollNumber = grievance.complainantId.rollNumber;
    }

    obj.timeline = logs.map((log) => ({
      id: log._id,
      title: log.fromLevel === log.toLevel ? 'Status Update' : `Tier ${log.toLevel} Escalation`,
      description: log.reason,
      timestamp: log.timestamp,
    }));

    res.status(200).json({
      success: true,
      data: obj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update grievance status (Resolve, In-Review, Close)
// @route   PATCH /api/authority/grievances/:id/status
// @access  Private (Authority, Admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const grievance = await findGrievanceByIdOrToken(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'Grievance not found in database' },
      });
    }

    if (status) {
      grievance.status = status;
    }

    if (status === 'Resolved' || status === 'Closed') {
      grievance.resolvedAt = new Date();
    }
    if (remarks !== undefined) {
      grievance.resolutionRemarks = remarks;
    }

    await grievance.save();

    // Log the status change
    await EscalationLog.create({
      grievanceId: grievance._id,
      fromLevel: grievance.currentLevel,
      toLevel: grievance.currentLevel,
      reason: remarks
        ? `Status updated to ${status}. Remarks: "${remarks}"`
        : `Status updated to ${status} by ${req.user.name}.`,
      escalatedBy: req.user._id,
      timestamp: new Date(),
    });

    // Notify complainant if identified
    if (grievance.complainantId) {
      await Notification.create({
        userId: grievance.complainantId,
        title: `Grievance Status: ${status}`,
        message: `Grievance ${grievance.trackingToken} status has been updated to "${status}".`,
        type: status === 'Resolved' ? 'RESOLVED' : 'STATUS_CHANGE',
        grievanceToken: grievance.trackingToken,
      });
    }

    const formatted = formatGrievance(grievance);

    res.status(200).json({
      success: true,
      data: formatted,
      message: `Grievance status updated to ${status} in database`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manual escalation by authority to higher tier
// @route   POST /api/authority/grievances/:id/escalate
// @access  Private (Authority, Admin)
exports.escalateManual = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const grievance = await findGrievanceByIdOrToken(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'Grievance not found in database' },
      });
    }

    const hierarchy = await HierarchyConfig.findOne({ category: grievance.category });
    const maxLevel = hierarchy ? hierarchy.levels.length : 4;

    const fromLevel = grievance.currentLevel;
    const nextLevel = Math.min(fromLevel + 1, maxLevel);
    const nextTierConfig = hierarchy?.levels?.find((l) => l.levelNumber === nextLevel);

    const isMax = nextLevel === maxLevel && fromLevel === maxLevel;
    const newStatus = isMax ? 'Overdue - Top Level' : 'Escalated';
    const now = new Date();
    const nextSlaHours = nextTierConfig?.slaHours || 48;
    const newDeadline = new Date(now.getTime() + nextSlaHours * 3600 * 1000);

    grievance.currentLevel = nextLevel;
    grievance.status = newStatus;
    grievance.slaDeadline = newDeadline;
    grievance.slaHoursTotal = nextSlaHours;
    await grievance.save();

    await EscalationLog.create({
      grievanceId: grievance._id,
      fromLevel,
      toLevel: nextLevel,
      reason: reason || `Manually escalated by ${req.user.name} (${req.user.role})`,
      escalatedBy: req.user._id,
      timestamp: now,
    });

    // Notify complainant if identified
    if (grievance.complainantId) {
      await Notification.create({
        userId: grievance.complainantId,
        title: `Grievance Escalated to Tier ${nextLevel}`,
        message: `Your grievance ${grievance.trackingToken} was escalated to Tier ${nextLevel}.`,
        type: 'ESCALATION',
        grievanceToken: grievance.trackingToken,
      });
    }

    // NOTIFY NEXT TIER AUTHORITIES
    try {
      const nextAuthorities = await User.find({
        role: 'authority',
        hierarchyLevel: nextLevel,
        $or: [
          { department: grievance.department },
          { department: 'General' },
          { department: 'Institutional General' },
          { department: null },
        ],
      });

      for (const nextAuth of nextAuthorities) {
        await Notification.create({
          userId: nextAuth._id,
          title: `Escalated Grievance Tier ${nextLevel}`,
          message: `Grievance ${grievance.trackingToken} was escalated to your tier (${nextTierConfig?.roleTitle || 'Authority'}).`,
          type: 'ESCALATION',
          grievanceToken: grievance.trackingToken,
        });
      }
    } catch (authNotifErr) {
      console.warn('[Notification Warning] Could not notify next tier authorities:', authNotifErr.message);
    }

    const formatted = formatGrievance(grievance, nextTierConfig?.roleTitle);

    res.status(200).json({
      success: true,
      data: formatted,
      message: `Grievance escalated to Tier ${nextLevel} in database`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: get all institutional grievances
// @route   GET /api/admin/grievances
// @access  Private (Admin)
exports.getAllGrievances = async (req, res, next) => {
  try {
    const { status, category, department, search } = req.query;
    let query = {};

    if (status && status !== 'ALL') query.status = status;
    if (category && category !== 'ALL') query.category = category;
    if (department && department !== 'ALL') query.department = department;
    if (search) {
      query.$or = [
        { trackingToken: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const grievances = await Grievance.find(query)
      .sort({ createdAt: -1 })
      .populate('complainantId', 'name email rollNumber');

    const formatted = grievances.map((g) => {
      const obj = formatGrievance(g);
      if (g.complainantId) {
        obj.complainantName = g.complainantId.name;
        obj.complainantEmail = g.complainantId.email;
        obj.complainantRollNumber = g.complainantId.rollNumber;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      data: formatted,
      count: formatted.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: override grievance tier or status
// @route   PATCH /api/admin/grievances/:id/override
// @access  Private (Admin)
exports.overrideGrievance = async (req, res, next) => {
  try {
    const { currentLevel, status, department, remarks } = req.body;
    const grievance = await findGrievanceByIdOrToken(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: { code: 'ERR_NOT_FOUND', message: 'Grievance not found in database' },
      });
    }

    const fromLevel = grievance.currentLevel;
    if (currentLevel) grievance.currentLevel = Number(currentLevel);
    if (status) {
      grievance.status = status;
      if (status === 'Resolved' || status === 'Closed') {
        grievance.resolvedAt = new Date();
      }
    }
    if (department) grievance.department = department;
    if (remarks) grievance.resolutionRemarks = remarks;

    await grievance.save();

    await EscalationLog.create({
      grievanceId: grievance._id,
      fromLevel,
      toLevel: grievance.currentLevel,
      reason: remarks || `Administrative override executed by Admin (${req.user.name})`,
      escalatedBy: req.user._id,
      timestamp: new Date(),
    });

    if (grievance.complainantId) {
      await Notification.create({
        userId: grievance.complainantId,
        title: `Grievance Administrative Update`,
        message: `Grievance ${grievance.trackingToken} was administratively updated to "${grievance.status}".`,
        type: 'STATUS_CHANGE',
        grievanceToken: grievance.trackingToken,
      });
    }

    const formatted = formatGrievance(grievance);

    res.status(200).json({
      success: true,
      data: formatted,
      message: 'Grievance updated via admin override in database',
    });
  } catch (error) {
    next(error);
  }
};
