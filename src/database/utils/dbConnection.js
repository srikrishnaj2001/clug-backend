const { sequelize } = require('../models');

/**
 * Test database connection
 * @returns {Promise<boolean>} - Returns true if connection is successful, false otherwise
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

/**
 * Sync database models
 * @param {boolean} force - If true, it will drop tables before creating them
 * @returns {Promise<boolean>} - Returns true if sync is successful, false otherwise
 */
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(`Database synchronized successfully${force ? ' (tables dropped)' : ''}`);
    return true;
  } catch (error) {
    console.error('Failed to sync database:', error);
    return false;
  }
};

/**
 * Close database connection
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels,
  closeConnection,
}; 