'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PushSubscription extends Model {
    static associate(models) {
      PushSubscription.belongsTo(models.Prelanding, {
        foreignKey: 'prelandingId',
        as: 'prelanding',
      });
    }
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
    },
    prelandingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    lastSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'PushSubscription',
    tableName: 'push_subscriptions',
    timestamps: true
  });
  return PushSubscription;
};