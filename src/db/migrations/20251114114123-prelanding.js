'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prelandings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      templateName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      subdomain: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      templateData: {
        type: Sequelize.JSONB,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM('pending', 'failed', 'repeat', 'deployed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('prelandings');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_prelandings_status";'
    );
  },
};
