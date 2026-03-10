'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('users', 'subscriptionType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'subscriptionStatus', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'subscriptionStartedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'stripeCustomerId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'stripeSubscriptionId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'subscriptionType');
    await queryInterface.removeColumn('users', 'subscriptionStatus');
    await queryInterface.removeColumn('users', 'subscriptionStartedAt');
    await queryInterface.removeColumn('users', 'stripeCustomerId');
    await queryInterface.removeColumn('users', 'stripeSubscriptionId');
  }
};
