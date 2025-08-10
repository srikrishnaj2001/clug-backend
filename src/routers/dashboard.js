'use strict';

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const dashboardService = require('../services/dashboardService');
const { checkUserEmail } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../utils/validation');
const { sendResponse } = require('../utils/helpers');

/**
 * @route  GET /courses
 * @desc   Get all courses with first course content for home page
 * @access Public (no authentication required)
 */
router.get('/courses', async (req, res) => {
  const result = await dashboardService.getCoursesWithFirstCourseContentForResponse();
  return sendResponse(res, result);
});

/**
 * @route  GET /courses/:courseId
 * @desc   Get complete course content by course ID
 * @param  {number} courseId - Course ID
 * @access Public (no authentication required)
 */
router.get('/courses/:courseId', 
  validate(Joi.object({ courseId: schemas.courseId }), 'params'),
  async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);
    const result = await dashboardService.getCourseContentByIdForResponse(courseId);
    return sendResponse(res, result);
  }
);

/**
 * @route  GET /dashboard
 * @desc   Root endpoint for dashboard (legacy)
 * @access Private (requires user-email header)
 */
router.get('/dashboard', checkUserEmail, (req, res) => {
  res.status(200).json({
    success: true,
    endpoints: [
      'GET /courses - Get all courses with first course content for home page',
      'GET /courses/:courseId - Get complete course content by course ID',
      'GET /dashboard/courses - Get all enrolled courses (supports pagination with ?page=1&limit=10)',
      'POST /dashboard/courses - Get courses based on user type (admin gets all, users get enrolled only)',
      'POST /dashboard/courses/simple - Get simple list of courses (just names and IDs) based on user type',
      '/dashboard/courses/:courseId - Get details of a specific course',
      '/dashboard/modules/:moduleId - Get contents of a specific module',
      '/dashboard/resources/:resourceId - Get details of a specific resource',
      '/dashboard/videos/:videoId - Get details of a specific video'
    ]
  });
});

// Legacy dashboard routes (keeping for backward compatibility)
/**
 * @route  GET /dashboard/courses
 * @desc   Get all courses that a user is enrolled in with pagination
 * @param  {number} [page=1] - Page number (default: 1)
 * @param  {number} [limit=10] - Number of items per page (default: 10, max: 100)
 * @access Private (requires user-email header)
 */
router.get('/dashboard/courses', 
  validate(schemas.pagination, 'query'),
  checkUserEmail,
  async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await dashboardService.getEnrolledCoursesForResponse(req.userEmail, page, limit);
    return sendResponse(res, result);
  }
);

/**
 * @route  POST /dashboard/courses
 * @desc   Get courses based on user type (admin gets all courses, regular users get enrolled courses)
 * @param  {string} email - User's email in request body
 * @param  {string} password - User's password in request body
 * @param  {number} [page=1] - Page number (default: 1)
 * @param  {number} [limit=10] - Number of items per page (default: 10, max: 100)
 * @access Public (authentication handled within the service)
 */
router.post('/dashboard/courses', 
  validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }), 'body'),
  validate(schemas.pagination, 'query'),
  async (req, res) => {
    const { email, password } = req.body;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const result = await dashboardService.getCoursesForResponse(email, password, page, limit);
    return sendResponse(res, result);
  }
);

/**
 * @route  POST /dashboard/courses/simple
 * @desc   Get simple list of courses (just names and IDs) based on user type
 * @param  {string} email - User's email in request body
 * @param  {string} password - User's password in request body
 * @access Public (authentication handled within the service)
 */
router.post('/dashboard/courses/simple', 
  validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }), 'body'),
  async (req, res) => {
    const { email, password } = req.body;
    const result = await dashboardService.getSimpleCoursesForResponse(email, password);
    return sendResponse(res, result);
  }
);

/**
 * @route  GET /dashboard/courses/:courseId
 * @desc   Get detailed information about a specific course (without module contents)
 * @access Private (requires user-email header)
 */
router.get('/dashboard/courses/:courseId', 
  validate(Joi.object({ courseId: schemas.courseId }), 'params'),
  checkUserEmail,
  async (req, res) => {
    const courseId = parseInt(req.params.courseId, 10);
    const result = await dashboardService.getCourseDetailsForResponse(
      req.userEmail, 
      courseId
    );
    return sendResponse(res, result);
  }
);

/**
 * @route  GET /dashboard/modules/:moduleId
 * @desc   Get detailed contents of a specific module
 * @access Private (requires user-email header)
 */
router.get('/dashboard/modules/:moduleId', 
  validate(Joi.object({ moduleId: schemas.moduleId }), 'params'),
  checkUserEmail,
  async (req, res) => {
    const moduleId = parseInt(req.params.moduleId, 10);
    const result = await dashboardService.getModuleContentsForResponse(
      req.userEmail, 
      moduleId
    );
    return sendResponse(res, result);
  }
);

/**
 * @route  GET /dashboard/resources/:resourceId
 * @desc   Get detailed information about a specific resource
 * @access Public (no authentication required)
 */
router.get('/dashboard/resources/:resourceId', 
  validate(Joi.object({ resourceId: schemas.resourceId }), 'params'),
  async (req, res) => {
    const resourceId = parseInt(req.params.resourceId, 10);
    const result = await dashboardService.getResourceDetailsForResponse(
      resourceId
    );
    return sendResponse(res, result);
  }
);

/**
 * @route  GET /dashboard/videos/:videoId
 * @desc   Get detailed information about a specific video
 * @access Public (no authentication required)
 */
router.get('/dashboard/videos/:videoId', 
  validate(Joi.object({ videoId: schemas.videoId }), 'params'),
  async (req, res) => {
    const videoId = parseInt(req.params.videoId, 10);
    const result = await dashboardService.getVideoDetailsForResponse(
      videoId
    );
    return sendResponse(res, result);
  }
);

module.exports = router; 