'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {

    static associate(models) {
      // define association here
      Users.hasMany(models.Data, { foreignKey: 'userId' });
    }
  }
  Users.init({
    Email: DataTypes.STRING(64),
    Password: DataTypes.STRING(255),
    Pseudo: DataTypes.STRING(150),
    Taille: DataTypes.DECIMAL(10, 2),
    Age: DataTypes.INTEGER,
    Sex: DataTypes.STRING(1)
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users',
    timestamps: true,
    underscored: false
  });
  return Users;
};