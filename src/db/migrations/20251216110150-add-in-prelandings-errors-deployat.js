'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('prelandings', 'deployed_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('prelandings', 'error_message', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('prelandings', 'deployed_at');
    await queryInterface.removeColumn('prelandings', 'error_message');
  }
};
