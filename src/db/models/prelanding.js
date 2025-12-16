'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Prelanding extends Model {
    static associate(models) {
    }
  }

  Prelanding.init(
    {
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
        type: DataTypes.ENUM("pending", "failed", "repeat", "done"),
        allowNull: false,
        defaultValue: "pending"
      },
      deployed_at: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      error_message: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Prelanding',
      tableName: 'Prelandings',  
      timestamps: true
    }
  );

  return Prelanding;
};
