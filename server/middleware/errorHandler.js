/**
 * Centralized API Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('[Error]', err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'ERR_INVALID_ID',
        message: `Resource not found with id of ${err.value}`,
      },
    });
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: {
        code: 'ERR_DUPLICATE_FIELD',
        message: `Duplicate entry for ${field}. That ${field} already exists.`,
      },
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: {
        code: 'ERR_VALIDATION',
        message: messages.join('. '),
      },
    });
  }

  // Default Internal Error
  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'ERR_INTERNAL_SERVER',
      message: error.message || 'Server Internal Error',
    },
  });
};

module.exports = errorHandler;
