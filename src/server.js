const dotenvFlow = require("dotenv-flow");
const app = require('./app');
// Uncomment the following line when you want to use the database
const { dbConnection } = require('./database');

// Load environment variables from .env files
if (process.env.NODE_ENV !== 'production') {
  const dotenvFlow = require('dotenv-flow');
  dotenvFlow.config();
}

// Set default NODE_ENV if not defined
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`Environment: ${process.env.NODE_ENV}`);

const PORT = process.env.PORT || 8008;

// Start server
const startServer = () => {
  // In production, skip database connection if no DATABASE_URL is provided
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    console.log('No DATABASE_URL provided - running without database');
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} (no database)`);
    });
    return;
  }

  // Try to connect to database but continue if it fails
  dbConnection.testConnection()
    .then(connected => {
      if (connected) {
        console.log('Successfully connected to the database');
        return dbConnection.syncModels(false);
      } else {
        console.log('Database connection failed but server will continue to run');
        return false;
      }
    })
    .catch(err => {
      console.error('Database initialization error:', err.message);
      console.log('Server will run without database connection');
    })
    .finally(() => {
      // Start the server regardless of database connection status
      app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      });
    });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥');
  console.error(err);
  
  // Don't exit if it's a database connection error in production
  if (process.env.NODE_ENV === 'production' && 
      (err.message?.includes('ENETUNREACH') || 
       err.message?.includes('SequelizeConnectionError') ||
       err.code === 'ENETUNREACH')) {
    console.log('Database connection error in production - continuing without database');
    return;
  }
  
  console.log('Shutting down...');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

startServer(); 