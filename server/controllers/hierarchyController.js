const mongoose = require('mongoose');
const HierarchyConfig = require('../models/HierarchyConfig');
const DEFAULT_HIERARCHIES = require('../config/defaultHierarchy');

// @desc    Get all hierarchy category configurations
// @route   GET /api/hierarchy
// @access  Public / Authenticated
exports.getAllHierarchyConfigs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: DEFAULT_HIERARCHIES,
      });
    }

    let configs = await HierarchyConfig.find().sort({ category: 1 });

    // If database is not yet seeded, return default hierarchies
    if (!configs || configs.length === 0) {
      configs = DEFAULT_HIERARCHIES;
    }

    res.status(200).json({
      success: true,
      data: configs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hierarchy config for a specific category
// @route   GET /api/hierarchy/:category
// @access  Public / Authenticated
exports.getCategoryHierarchy = async (req, res, next) => {
  try {
    const { category } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const defaultMatch = DEFAULT_HIERARCHIES.find(
        (h) => h.category.toLowerCase() === category.toLowerCase()
      );
      if (defaultMatch) {
        return res.status(200).json({ success: true, data: defaultMatch });
      }
    }

    let config = await HierarchyConfig.findOne({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    });

    if (!config) {
      // Check default fallback
      const defaultMatch = DEFAULT_HIERARCHIES.find(
        (h) => h.category.toLowerCase() === category.toLowerCase()
      );
      if (defaultMatch) {
        config = defaultMatch;
      } else {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: `Hierarchy for category '${category}' not found.` },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hierarchy tiers and SLA hours for a category
// @route   PUT /api/hierarchy/:category
// @access  Private (Admin)
exports.updateCategoryHierarchy = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { levels } = req.body;

    if (!levels || !Array.isArray(levels) || levels.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'ERR_VALIDATION', message: 'Valid array of tier levels is required.' },
      });
    }

    // Upsert configuration
    const updated = await HierarchyConfig.findOneAndUpdate(
      { category },
      { category, levels },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: `Hierarchy configuration for '${category}' updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
