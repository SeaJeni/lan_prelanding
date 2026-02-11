'use strict';
const { Model } = require('sequelize');
const { PUSH_TASK_STATUSES, SUBSCRIPTION_AGE } = require('../../constants/enums');

module.exports = (sequelize, DataTypes) => {
  class PushNotificationTask extends Model {
    static associate(models) {
      PushNotificationTask.belongsTo(models.Prelanding, {
        foreignKey: 'prelandingId',
        as: 'prelanding',
      });
      PushNotificationTask.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  } 

  PushNotificationTask.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prelandingName: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    geo: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    vertical: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
    device: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionAge: {
      type: DataTypes.ENUM(...SUBSCRIPTION_AGE),
      allowNull: false,
      defaultValue: 'all',
    },
    status: {
      type: DataTypes.ENUM(...PUSH_TASK_STATUSES),
      allowNull: false,
      defaultValue: 'pending',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,     
      allowNull: false,      
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'PushNotificationTask',
    tableName: 'push_notification_tasks',
    timestamps: true
  });
  return PushNotificationTask;
};