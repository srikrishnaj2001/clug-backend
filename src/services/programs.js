const { Program } = require('../database/models');

async function findAll() {
  const rows = await Program.findAll({ order: [['id', 'ASC']] });
  return { success: true, statusCode: 200, data: rows };
}

async function findOne(id) {
  const row = await Program.findByPk(id);
  if (!row) return { success: false, statusCode: 404, message: 'Program not found' };
  return { success: true, statusCode: 200, data: row };
}

module.exports = { findAll, findOne }; 