const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    trackingToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Grievance title is required'],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Academic', 'Hostel', 'Harassment', 'Infrastructure', 'Faculty Conduct', 'Other'],
    },
    department: {
      type: String,
      default: 'General',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: 10,
      maxlength: 5000,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    complainantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    submittedByHash: {
      type: String,
      required: true,
      index: true,
    },
    currentLevel: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In-Review', 'Escalated', 'Resolved', 'Closed', 'Overdue - Top Level'],
      default: 'Pending',
    },
    slaDeadline: {
      type: Date,
      required: true,
    },
    slaHoursTotal: {
      type: Number,
      default: 24,
    },
    resolutionRemarks: {
      type: String,
      default: null,
      trim: true,
      maxlength: 2000,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes
grievanceSchema.index({ status: 1, slaDeadline: 1 });
grievanceSchema.index({ currentLevel: 1, department: 1, status: 1 });
grievanceSchema.index({ submittedByHash: 1, createdAt: -1 });
grievanceSchema.index({ complainantId: 1, createdAt: -1 });

module.exports = mongoose.model('Grievance', grievanceSchema);
