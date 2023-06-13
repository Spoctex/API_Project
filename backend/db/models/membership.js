'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User,
        { foreignKey: 'userId' });
      Membership.belongsTo(models.Group,
        { foreignKey: 'groupId' });
    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Membership;
};