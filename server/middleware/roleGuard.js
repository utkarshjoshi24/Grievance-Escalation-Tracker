/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} roles Permitted roles ('student', 'authority', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ERR_UNAUTHORIZED',
          message: 'Authentication required for this operation',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ERR_FORBIDDEN',
          message: `User role '${req.user.role}' is not authorized to access this route`,
        },
      });
    }

    next();
  };
};

module.exports = { authorize };
