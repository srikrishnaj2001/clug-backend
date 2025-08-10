"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("enrollments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      courseId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'courses', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('enrollments', ['userId']);
    await queryInterface.addIndex('enrollments', ['courseId']);
    await queryInterface.addIndex('enrollments', ['userId', 'courseId'], { unique: true });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("enrollments");
  }
}; 