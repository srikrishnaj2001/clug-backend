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
app.use('/ai-transcript', aiTranscriptRouter)

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate()

    res.status(200).json({
      success: true,
      database: 'Connected',
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'DOWN.',
      error: error.message,
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
