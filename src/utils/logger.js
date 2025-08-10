'use strict';

/**
 * Simple logger utility to standardize logging across the application
 * This can be replaced with a more robust solution like Winston in the future
 */
class Logger {
  /**
   * Log informational message
   * @param {string} message - Log message
   * @param {Object} [meta={}] - Additional metadata to log
   */
  static info(message, meta = {}) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      timestamp,
      level: 'info',
      message,
      ...meta
    }));
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} [meta={}] - Additional metadata to log
   */
  static warn(message, meta = {}) {
    const timestamp = new Date().toISOString();
    console.warn(JSON.stringify({
      timestamp,
      level: 'warn',
      message,
      ...meta
    }));
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Error} error - Error object
   * @param {Object} [meta={}] - Additional metadata to log
   */
  static error(message, error, meta = {}) {
    const timestamp = new Date().toISOString();
    console.error(JSON.stringify({
      timestamp,
      level: 'error',
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      ...meta
    }));
  }

  /**
   * Log HTTP request 
   * @param {Object} req - Express request object
   * @param {string} [message='HTTP Request'] - Log message
   */
  static request(req, message = 'HTTP Request') {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      timestamp,
      level: 'info',
      message,
      request: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    }));
  }
}

module.exports = Logger; 