const { Section } = require('../database/models');

async function findAll() {
  const rows = await Section.findAll({ order: [['id', 'ASC']] });
  return { success: true, statusCode: 200, data: rows };
}

async function findOne(id) {
  const row = await Section.findByPk(id);
  if (!row) return { success: false, statusCode: 404, message: 'Section not found' };
  return { success: true, statusCode: 200, data: row };
}

module.exports = { findAll, findOne }; 