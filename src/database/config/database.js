"use strict";

if (process.env.NODE_ENV !== 'production') {
  const dotenvFlow = require('dotenv-flow');
  dotenvFlow.config();
}

const Logger = require("../../utils/logger");

// Use environment variable if set, otherwise use local development URL
const databaseUrl =  process.env.DATABASE_URL;

// Mask sensitive connection details for logging
const maskedUrl = databaseUrl.replace(/\/\/(.+):(.+)@/, '//****:****@');
Logger.info(`Using database connection: ${maskedUrl}`);

// Base configuration with optimized connection pool
const baseConfig = {
  url: databaseUrl,
  dialect: "postgres",
  logging: false, // Set to console.log if you want to see SQL queries
  define: {
    timestamps: true,
  },
  // Connection pool configuration for better performance
  pool: {
    max: 20,        // Maximum number of connections 
    min: 5,         // Minimum number of connections 
    idle: 10000,    // Maximum time (ms) that a connection can be idle before being released
    acquire: 30000, // Maximum time (ms) that pool will try to get connection before throwing error
    evict: 30000    // How frequently to check for idle connections to evict
  },
  // Optimizations for Sequelize
  dialectOptions: {
    // Statement timeout in milliseconds (5 seconds)
    // This prevents queries from running too long
    statement_timeout: 5000
  }
};

const testConfig = {
  ...baseConfig,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000
  }
};

const productionConfig = {
  ...baseConfig,
  // In production, we want more careful connection handling
  pool: {
    max: 50,       // Higher max for production traffic
    min: 10,       // Higher min for production traffic
    idle: 10000,
    acquire: 60000 // Longer acquire timeout for production
  },
  dialectOptions: {
    ...baseConfig.dialectOptions,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    // Add statement timeout for production
    statement_timeout: 10000 // 10 seconds in production
  },
};

const config = {
  development: baseConfig,
  test: testConfig,
  production: productionConfig,
};

module.exports = config; 