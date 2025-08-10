const { User, Course, Enrollment, UserMetadata } = require('../database/models');

async function findAll() {
  const rows = await User.findAll({ order: [['id', 'ASC']] });
  return { success: true, statusCode: 200, data: rows };
}

async function findOne(id) {
  const row = await User.findByPk(id, {
    include: [
      { model: UserMetadata, as: 'metadata' }
    ]
  });
  if (!row) return { success: false, statusCode: 404, message: 'User not found' };
  return { success: true, statusCode: 200, data: row };
}

async function findCourses(userId) {
  // Verify user exists (cheap primary key lookup)
  const user = await User.findByPk(userId, { attributes: ['id'] });
  if (!user) return { success: false, statusCode: 404, message: 'User not found' };

  // Optimized: single query to fetch courses joined via enrollments
  const courses = await Course.findAll({
    attributes: ['id', 'name', 'description', 'programId', 'thumbnailUrl', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Enrollment,
        as: 'enrollments',
        attributes: [],
        where: { userId }
      }
    ],
    order: [['id', 'ASC']],
    subQuery: false
  });

  return { success: true, statusCode: 200, data: courses };
}

module.exports = { findAll, findOne, findCourses }; 