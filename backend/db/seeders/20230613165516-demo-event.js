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
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId:1,
        groupId:2,
        name:'name1',
        description:'description1',
        type:'Online',
        capacity:1,
        price:20.91,
        startDate: '2023-12-19 03:00:01',
        endDate: '2023-12-19 08:00:02',
      },
      {
        venueId:2,
        groupId:1,
        name:'name2',
        description:'description2',
        type:'In person',
        capacity:2,
        price:20.92,
        startDate: '2023-12-19 03:00:03',
        endDate: '2023-12-19 08:00:04',
      },
      {
        venueId:1,
        groupId:1,
        name:'name3',
        type:'In person',
        startDate: '2023-12-19 03:00:05',
        endDate: '2023-12-19 08:00:06',
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['name1','name2','name3'] }
    }, {});
  }
};
