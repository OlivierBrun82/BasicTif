'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      Password: {
        type: Sequelize.STRING(72),
        allowNull: false,
        validate: {
          len: [8, 72]
        }
      },
      Pseudo: {
        type: Sequelize.STRING(150)
      },
      Taille: {
        type: Sequelize.DECIMAL(10, 2)
      },
      Age: {
        type: Sequelize.INTEGER
      },
      Sex: {
        type: Sequelize.STRING(1)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};