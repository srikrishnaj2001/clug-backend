const { sendResponse } = require('../utils/helpers');

// Middleware to check if database is required and available
const requireDatabase = (req, res, next) => {
  // Check if we're in production without database
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    return sendResponse(res, {
      success: false,
      statusCode: 503,
      message: 'Database not available. This endpoint requires a database connection.'
    });
  }
  
  // For AI transcript endpoints, no database is needed
  if (req.path.startsWith('/ai-transcript')) {
    return next();
  }
  
  next();
};

// Middleware to handle database-dependent routes gracefully
const optionalDatabase = (req, res, next) => {
  // Add a flag to indicate if database is available
  req.dbAvailable = !!(process.env.DATABASE_URL || process.env.NODE_ENV !== 'production');
  next();
};

module.exports = {
  requireDatabase,
  optionalDatabase
}; 