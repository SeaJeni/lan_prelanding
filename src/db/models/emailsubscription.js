'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailSubscription extends Model {
    static associate(models) {
      EmailSubscription.belongsTo(models.Prelanding, {
        foreignKey: 'prelandingId',
        as: 'prelanding',
      });
    }
  }

  EmailSubscription.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,       
        validate: {
          isEmail: true     
        }
      },
      prelandingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      }
    },
    {
      sequelize,
      modelName: 'EmailSubscription',
      tableName: 'email_subscriptions',
      timestamps: true
    }
  );

  return EmailSubscription;
};

