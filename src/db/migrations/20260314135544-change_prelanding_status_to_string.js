'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "prelandings"
      ALTER COLUMN "status"
      TYPE VARCHAR(255)
      USING "status"::text;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "prelandings"
      ALTER COLUMN "status"
      TYPE "enum_prealandings_status"
      USING "status"::"enum_prealandings_status";
    `);
  }
};
