'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailSubscription extends Model {
    static associate(models) {}
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
      }
    },
    {
      sequelize,
      modelName: 'EmailSubscription',
      tableName: 'EmailSubscriptions',
      timestamps: true
    }
  );

  return EmailSubscription;
};

