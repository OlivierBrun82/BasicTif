'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Data extends Model {
    static associate(models) {
      // define association here
      Data.belongsTo(models.Users, { foreignKey: 'userId' });
    }
  }
  Data.init({
    Poids: DataTypes.DECIMAL(10, 2),
    IMC: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'Data',
    tableName: 'data',
    timestamps: true,
    underscored: true
  });
  return Data;
};