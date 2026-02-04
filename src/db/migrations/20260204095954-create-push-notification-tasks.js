'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('push_notification_tasks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      prelandingName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      geo: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      vertical: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      device: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      subscriptionAge: {
        type: Sequelize.ENUM('0-3', '3-7', '7-30', 'all'),
        allowNull: false,
        defaultValue: 'all',
      },

       status: {
        type: Sequelize.ENUM('pending', 'failed', 'processing', 'done'),
        allowNull: false,
        defaultValue: 'pending',
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('prelandings');
  }
};
