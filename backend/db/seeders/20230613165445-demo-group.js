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
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId:1,
        name:'Group1',
        about:'about1',
        type:'tech',
        private: true,
        city:'city1',
        state:'NH'
      },
      {
        organizerId:2,
        name:'Group2',
        about:'about2',
        type:'sports',
        private: false,
        city:'city2',
        state:'NY'
      },
      {
        organizerId:2,
        name:'Group3',
        type:'literature',
        private: true,
        city:'city3',
        state:'NJ'
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Group1','Group2','Group3'] }
    }, {});
  }
};
