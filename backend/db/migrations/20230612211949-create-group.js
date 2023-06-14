'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users' },
        onDelete: 'CASCADE'
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(30)
      },
      about: {
        type: Sequelize.TEXT
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('tech','sports','literature')
      },
      private: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.dropTable(options);
  }
};
