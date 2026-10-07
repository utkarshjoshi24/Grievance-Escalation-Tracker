const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['student', 'authority', 'admin'],
      default: 'student',
      required: true,
    },
    hierarchyLevel: {
      type: Number,
      default: null,
      validate: {
        validator: function (val) {
          if (val === null || val === undefined) {
            return this.role !== 'authority';
          }
          return typeof val === 'number' && val >= 1;
        },
        message: 'hierarchyLevel is required for authority role and must be >= 1',
      },
    },
    department: {
      type: String,
      default: null,
      trim: true,
    },
    rollNumber: {
      type: String,
      default: null,
      trim: true,
    },
    title: {
      type: String,
      default: null,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, hierarchyLevel: 1, department: 1 });

// Helper instance method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// Remove passwordHash from returned JSON objects
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
