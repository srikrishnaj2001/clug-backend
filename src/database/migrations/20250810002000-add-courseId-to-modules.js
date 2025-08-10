"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'modules',
        'courseId',
        { type: Sequelize.INTEGER, allowNull: true, references: { model: 'courses', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
        { transaction }
      );
      await queryInterface.addIndex('modules', ['courseId'], { transaction });

      // Backfill based on seeded IDs (1,2 -> course 1; 3,4 -> course 2)
      await queryInterface.sequelize.query(
        "UPDATE modules SET \"courseId\" = 1 WHERE id IN (1,2);",
        { transaction }
      );
      await queryInterface.sequelize.query(
        "UPDATE modules SET \"courseId\" = 2 WHERE id IN (3,4);",
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeIndex('modules', ['courseId'], { transaction });
      await queryInterface.removeColumn('modules', 'courseId', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}; 