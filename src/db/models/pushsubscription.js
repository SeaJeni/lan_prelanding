'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PushSubscription extends Model {
    static associate(models) {}
  }
  PushSubscription.init({
    enspoint: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    p256dh_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    auth_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'PushSubscription',
    tableName: 'PushSubscriptions',
    timestamps: true
  });
  return PushSubscription;
};