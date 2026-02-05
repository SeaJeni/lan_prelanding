'use strict';

const { Model } = require('sequelize');
const { PRELANDING_STATUSES } = require('../../constants/enums');

module.exports = (sequelize, DataTypes) => {
  class Prelanding extends Model {
    static associate(models) {
       Prelanding.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      Prelanding.hasOne(models.EmailSubscription, {
        foreignKey: 'prelandingId',
        as: 'emailSubscription',
      });
    }
  }

  Prelanding.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
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
        type: DataTypes.ENUM(...PRELANDING_STATUSES),
        allowNull: false,
        defaultValue: "pending",
      },
      deployed_at: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      error_message: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      geo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vertical: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Prelanding',
      tableName: 'prelandings',  
      timestamps: true
    }
  );

  return Prelanding;
};
