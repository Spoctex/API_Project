'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId:1,
        url:'www.google.com/4',
        preview:true
      },
      {
        eventId:1,
        url:'www.google.com/5',
        preview:false
      },
      {
        eventId:2,
        url:'www.google.com/6',
        preview:true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.google.com/4','www.google.com/5','www.google.com/6'] }
    }, {});
  }
};
