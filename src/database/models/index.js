const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const dbConfig = require('../config/database');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const db = {};

// Create Sequelize instance
let sequelize;
if (config.url) {
  // If URL is provided, use it directly
  sequelize = new Sequelize(config.url, config);
} else {
  // Otherwise use individual connection parameters (should not happen with our config)
  console.warn('No database URL found, using individual connection parameters');
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all model files in the current directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file !== 'associations.js' && // Skip the associations file during model loading
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations using the dedicated file
const setupAssociations = require('./associations');
setupAssociations(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 