const { Example } = require('../database/models');

async function findAll() {
  const rows = await Example.findAll({ order: [['id', 'ASC']] });
  return { success: true, statusCode: 200, data: rows };
}

async function findOne(id) {
  const row = await Example.findByPk(id);
  if (!row) return { success: false, statusCode: 404, message: 'Example not found' };
  return { success: true, statusCode: 200, data: row };
}

module.exports = { findAll, findOne }; 