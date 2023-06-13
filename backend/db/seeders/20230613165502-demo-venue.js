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
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId:1,
        address:'address1',
        city:'city1',
        state:'NH',
        lat:23.621,
        lng:23.621
      },
      {
        groupId:1,
        address:'address2',
        city:'city2',
        state:'NH',
        lat:23.622,
        lng:23.622
      },
      {
        groupId:2,
        address:'address3',
        city:'city3',
        state:'NY',
        lat:23.623,
        lng:23.623
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      city: { [Op.in]: ['city1','city2','city3'] }
    }, {});
  }
};
