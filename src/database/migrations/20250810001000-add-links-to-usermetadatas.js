"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'usermetadatas',
        'pictureUrl',
        { type: Sequelize.STRING, allowNull: true, comment: 'Optional profile image URL' },
        { transaction }
      );
      await queryInterface.addColumn(
        'usermetadatas',
        'linkedinUrl',
        { type: Sequelize.STRING, allowNull: true, comment: 'Optional LinkedIn profile URL' },
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
      await queryInterface.removeColumn('usermetadatas', 'pictureUrl', { transaction });
      await queryInterface.removeColumn('usermetadatas', 'linkedinUrl', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}; 