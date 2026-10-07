const mongoose = require('mongoose');

const escalationLogSchema = new mongoose.Schema({
  grievanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grievance',
    required: true,
    index: true,
  },
  fromLevel: {
    type: Number,
    required: true,
    min: 1,
  },
  toLevel: {
    type: Number,
    required: true,
    min: 1,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  escalatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

escalationLogSchema.index({ grievanceId: 1, timestamp: 1 });

module.exports = mongoose.model('EscalationLog', escalationLogSchema);
