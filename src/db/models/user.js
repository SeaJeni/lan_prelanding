'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
       User.hasMany(models.Prelanding, {
        foreignKey: 'userId',
        as: 'prelandings',
      });
      User.hasMany(models.PushNotificationTask, {
        foreignKey: 'userId',
        as: 'pushTasks',
      });
  }
}

 User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {isEmail: true},
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscriptionType: {
       type: DataTypes.STRING,
       allowNull: true,
    },
    subscriptionStatus: {
      type: DataTypes.STRING,
       allowNull: true,
    },
    subscriptionStartedAt: {
       type: DataTypes.DATE,
       allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionCanceledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
  });

  return User;
};
