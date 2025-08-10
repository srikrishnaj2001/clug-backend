/**
 * This file defines all the model associations separately to avoid circular dependencies
 * It gets imported by the models/index.js after all models are loaded
 */

module.exports = function setupAssociations(db) {
  // Users
  if (db.User) {
    db.User.hasMany(db.Enrollment, { foreignKey: 'userId', as: 'enrollments' });
    db.Enrollment && db.User.belongsToMany(db.Course, { through: db.Enrollment, foreignKey: 'userId', otherKey: 'courseId', as: 'courses' });
    db.UserMetadata && db.User.hasOne(db.UserMetadata, { foreignKey: 'userId', as: 'metadata' });
  }

  if (db.UserMetadata) {
    db.UserMetadata.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
  }

  // Programs and Courses
  if (db.Program) {
    db.Program.hasMany(db.Course, { foreignKey: 'programId', as: 'courses' });
  }
  if (db.Course) {
    db.Course.belongsTo(db.Program, { foreignKey: 'programId', as: 'program' });
    db.Enrollment && db.Course.hasMany(db.Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
    db.User && db.Course.belongsToMany(db.User, { through: db.Enrollment, foreignKey: 'courseId', otherKey: 'userId', as: 'students' });
    db.Module && db.Course.hasMany(db.Module, { foreignKey: 'courseId', as: 'modules' });
  }

  if (db.Module) {
    db.Module.belongsTo(db.Course, { foreignKey: 'courseId', as: 'course' });
    db.Section && db.Module.hasMany(db.Section, { foreignKey: 'moduleId', as: 'sections' });
  }

  if (db.Section) {
    db.Section.belongsTo(db.Module, { foreignKey: 'moduleId', as: 'module' });
  }

  // No explicit M:N links for modules/resources/videos/etc per spec
  return db;
}; 