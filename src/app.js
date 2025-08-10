const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// Import custom utilities
const Logger = require('./utils/logger')

// Import routes
// const dashboardRoutes = require('./routers/dashboard')
const usersRouter = require('./routers/users')
const usermetadatasRouter = require('./routers/usermetadatas')
const programsRouter = require('./routers/programs')
const coursesRouter = require('./routers/courses')
const modulesRouter = require('./routers/modules')
const videosRouter = require('./routers/videos')
const resourcesRouter = require('./routers/resources')
const eventsRouter = require('./routers/events')
const examplesRouter = require('./routers/examples')
const assignmentsRouter = require('./routers/assignments')
const sectionsRouter = require('./routers/sections')
const enrollmentsRouter = require('./routers/enrollments')
const aiTranscriptRouter = require('./routers/ai-transcript')

// Import database connection
const { sequelize } = require('./database/models')

// Initialize express app
const app = express()

// Middleware
app.use(helmet()) // Security headers
app.use(morgan('dev')) // Logging
app.use(cors()) // CORS
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Improved request logging with structured JSON logs
app.use((req, res, next) => {
  Logger.request(req)
  next()
})

// Home route with health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    health: 'OK',
  })
})

// Register routes (simple, flat, fast)
// AI transcript routes (no database required)
app.use('/ai-transcript', aiTranscriptRouter)

// Database-dependent routes (only register if database is available)
const isDatabaseAvailable = process.env.DATABASE_URL || process.env.NODE_ENV !== 'production'

if (isDatabaseAvailable) {
  console.log('Database available - registering all routes')
  // app.use('/dashboard', dashboardRoutes)
  app.use('/users', usersRouter)
  app.use('/usermetadatas', usermetadatasRouter)
  app.use('/programs', programsRouter)
  app.use('/courses', coursesRouter)
  app.use('/modules', modulesRouter)
  app.use('/videos', videosRouter)
  app.use('/resources', resourcesRouter)
  app.use('/events', eventsRouter)
  app.use('/examples', examplesRouter)
  app.use('/assignments', assignmentsRouter)
  app.use('/sections', sectionsRouter)
  app.use('/enrollments', enrollmentsRouter)
} else {
  console.log('Database not available - only AI transcript routes registered')
  
  // Add a catch-all for database-dependent routes
  const databaseRoutes = [
    '/users', '/usermetadatas', '/programs', '/courses', '/modules', 
    '/videos', '/resources', '/events', '/examples', '/assignments', 
    '/sections', '/enrollments'
  ]
  
  databaseRoutes.forEach(route => {
    app.use(route, (req, res) => {
      res.status(503).json({
        success: false,
        message: 'Database not available. Only AI transcript endpoints are accessible.',
        availableEndpoints: [
          'GET /health',
          'GET /ai-transcript/available',
          'GET /ai-transcript/info/:videoId',
          'POST /ai-transcript/chat',
          'POST /ai-transcript/ask'
        ]
      })
    })
  })
}

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      aiTranscript: 'Available'
    }

    // Only check database if it's supposed to be available
    if (isDatabaseAvailable) {
      try {
        await sequelize.authenticate()
        healthStatus.database = 'Connected'
      } catch (error) {
        healthStatus.database = 'Disconnected'
        healthStatus.databaseError = error.message
      }
    } else {
      healthStatus.database = 'Not configured (AI transcript only mode)'
    }

    res.status(200).json(healthStatus)
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'DOWN',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// 404 handler
app.use((req, res) => {
  Logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
  })
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// Improved error handler with structured logging
app.use((err, req, res, next) => {
  Logger.error('Unhandled error', err, {
    method: req.method,
    url: req.originalUrl,
  })

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
  })
})

module.exports = app
