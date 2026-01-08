module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
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
  }, {
    tableName: 'users',
    underscored: true,
  });
};
