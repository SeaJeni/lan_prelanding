'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PushSubscription extends Model {
    static associate(models) {}
  }
  PushSubscription.init({
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'p256dh_key'
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'auth_key'
    }
  }, {
    sequelize,
    modelName: 'PushSubscription',
    tableName: 'push_subscriptions',
    timestamps: true
  });
  return PushSubscription;
};