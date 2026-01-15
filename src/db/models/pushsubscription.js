'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PushSubscription extends Model {
    static associate(models) {
      PushSubscription.belongsTo(models.Prelanding, {
        foreignKey: 'prelanding_id',
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
    prelanding_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'PushSubscription',
    tableName: 'push_subscriptions',
    timestamps: true
  });
  return PushSubscription;
};