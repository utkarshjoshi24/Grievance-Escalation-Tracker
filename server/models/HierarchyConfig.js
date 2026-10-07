const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
  {
    levelNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    roleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    slaHours: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { _id: false }
);

const hierarchyConfigSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      enum: ['Academic', 'Hostel', 'Harassment', 'Infrastructure', 'Faculty Conduct', 'Other'],
    },
    levels: {
      type: [levelSchema],
      required: true,
      validate: {
        validator: function (levels) {
          return Array.isArray(levels) && levels.length > 0;
        },
        message: 'At least one hierarchy tier level must be configured per category',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HierarchyConfig', hierarchyConfigSchema);
