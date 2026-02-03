'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('prelandings', 'geo', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('prelandings', 'vertical', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('prelandings', 'geo');
    await queryInterface.removeColumn('prelandings', 'vertical');
  }
};
