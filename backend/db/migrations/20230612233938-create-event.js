'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: {model:'Venues'},
        onDelete: 'CASCADE'
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model:'Groups'},
        onDelete: 'CASCADE'
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('tech','sports','literature')
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
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
    options.tableName = 'Events';
    return queryInterface.dropTable(options);
  }
};
