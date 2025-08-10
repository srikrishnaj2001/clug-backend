"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'sections',
        'moduleId',
        { type: Sequelize.INTEGER, allowNull: true, references: { model: 'modules', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
        { transaction }
      );
      await queryInterface.addIndex('sections', ['moduleId'], { transaction });

      // Backfill sample mapping: 1-3 -> module 1; 4-6 -> module 2; 7-8 -> module 3; 9-11 -> module 4
      await queryInterface.sequelize.query(
        "UPDATE sections SET \"moduleId\" = 1 WHERE id IN (1,2,3);",
        { transaction }
      );
      await queryInterface.sequelize.query(
        "UPDATE sections SET \"moduleId\" = 2 WHERE id IN (4,5,6);",
        { transaction }
      );
      await queryInterface.sequelize.query(
        "UPDATE sections SET \"moduleId\" = 3 WHERE id IN (7,8);",
        { transaction }
      );
      await queryInterface.sequelize.query(
        "UPDATE sections SET \"moduleId\" = 4 WHERE id IN (9,10,11);",
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
      await queryInterface.removeIndex('sections', ['moduleId'], { transaction });
      await queryInterface.removeColumn('sections', 'moduleId', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}; 