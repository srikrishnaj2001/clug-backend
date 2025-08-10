'use strict';

const Joi = require('joi');

// Validation schemas
const schemas = {
  // Course validation schemas
  courseId: Joi.number().integer().required().messages({
    'number.base': 'Course ID must be a number',
    'number.integer': 'Course ID must be an integer',
    'any.required': 'Course ID is required'
  }),

  // Module validation schemas
  moduleId: Joi.number().integer().required().messages({
    'number.base': 'Module ID must be a number',
    'number.integer': 'Module ID must be an integer',
    'any.required': 'Module ID is required'
  }),

  // Resource validation schemas
  resourceId: Joi.number().integer().required().messages({
    'number.base': 'Resource ID must be a number',
    'number.integer': 'Resource ID must be an integer',
    'any.required': 'Resource ID is required'
  }),

  // Video validation schemas
  videoId: Joi.number().integer().required().messages({
    'number.base': 'Video ID must be a number',
    'number.integer': 'Video ID must be an integer',
    'any.required': 'Video ID is required'
  }),

  // Pagination parameters validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be greater than or equal to 1'
    }),
    limit: Joi.number().integer().min(1).max(10).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be greater than or equal to 1',
      'number.max': 'Limit must be less than or equal to 10'
    })
  }),

  // Program validation schemas
  programId: Joi.number().integer().required().messages({
    'number.base': 'Program ID must be a number',
    'number.integer': 'Program ID must be an integer',
    'any.required': 'Program ID is required'
  })
};

/**
 * Middleware factory to validate request params, query or body
 * @param {Object} schema - Joi schema to validate against
 * @param {string} property - Request property to validate (params, query, body)
 * @returns {Function} Express middleware function
 */
const validate = (schema, property) => {
  return (req, res, next) => {
    // Special handling for pagination to use defaults instead of errors
    if (property === 'query' && schema === schemas.pagination) {
      const { error, value } = schema.validate(req[property], { abortEarly: false });
      
      // Use defaults instead of returning error
      if (error) {
        // Set page to 1 if invalid
        if (!req[property].page || req[property].page < 1) {
          req[property].page = 1;
        }
        
        // Set limit to default or cap at max
        if (!req[property].limit || req[property].limit < 1) {
          req[property].limit = 10;
        } else if (req[property].limit > 10) {
          req[property].limit = 10;
        }
        
        // Run validation again with fixed values
        const { value: fixedValue } = schema.validate(req[property]);
        req[property] = fixedValue;
        next();
        return;
      }
      
      // If no error, just continue
      req[property] = value;
      next();
      return;
    }
    
    // Normal validation for non-pagination
    const { error, value } = schema.validate(req[property]);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

module.exports = {
  schemas,
  validate
}; 