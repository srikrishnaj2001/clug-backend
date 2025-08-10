const { Video } = require('../database/models');

async function findAll() {
  const rows = await Video.findAll({ order: [['id', 'ASC']] });
  return { success: true, statusCode: 200, data: rows };
}

async function findOne(id) {
  const row = await Video.findByPk(id);
  if (!row) return { success: false, statusCode: 404, message: 'Video not found' };
  return { success: true, statusCode: 200, data: row };
}

module.exports = { findAll, findOne }; 