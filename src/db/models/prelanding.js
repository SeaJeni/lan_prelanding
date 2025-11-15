'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prelanding = sequelize.define('Prelanding', {
    templateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    templateData: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "faild", "repeat", "done"),
      allowNull: false,
      defaultValue: "pending"
    }
  });

  return Prelanding;
}