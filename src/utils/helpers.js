'use strict';

/**
 * Helper function to catch async errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Filter object to only include allowed fields
 * @param {Object} obj - Object to filter
 * @param {Array} allowedFields - Array of allowed field names
 * @returns {Object} - Filtered object
 */
const filterObject = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

/**
 * Format validation errors from express-validator
 * @param {Array} errors - Array of validation errors
 * @returns {Object} - Formatted errors object
 */
const formatValidationErrors = (errors) => {
  return errors.array().reduce((acc, error) => {
    acc[error.param] = error.msg;
    return acc;
  }, {});
};

/**
 * Paginate results
 * @param {Object} options - Pagination options
 * @returns {Object} - Pagination result
 */
const paginate = async (model, options = {}) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;
  
  const { count, rows } = await model.findAndCountAll({
    ...options,
    limit,
    offset,
  });
  
  return {
    results: rows,
    pagination: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
    },
  };
};

/**
 * Sends a standardized API response
 * @param {Object} res - Express response object
 * @param {Object} result - Response data with status code and content
 */
const sendResponse = (res, result) => {
  const { statusCode, success, message, data, error, pagination } = result;
  
  const responseBody = {
    success: success !== undefined ? success : statusCode < 400,
  };
  
  // Only include these fields if they exist
  if (message) responseBody.message = message;
  if (data) responseBody.data = data;
  if (error) responseBody.error = error;
  if (pagination) responseBody.pagination = pagination;
  
  return res.status(statusCode).json(responseBody);
};

module.exports = {
  catchAsync,
  filterObject,
  formatValidationErrors,
  paginate,
  sendResponse
}; 