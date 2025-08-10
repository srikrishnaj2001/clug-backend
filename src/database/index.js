const db = require('./models');
const dbConnection = require('./utils/dbConnection');

module.exports = {
  ...db,
  dbConnection,
}; 