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
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      // User 1
      {
        eventId: 1,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 1,
        status: 'waitlist'
      },
      // User 2
      {
        eventId: 2,
        userId: 2,
        status: 'attending'
      },
      {
        eventId: 4,
        userId: 2,
        status: 'pending'
      },
      {
        eventId: 6,
        userId: 2,
        status: 'attending'
      },
      // User 3
      {
        eventId: 3,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 7,
        userId: 3,
        status: 'pending'
      },
      // User 4
      {
        eventId: 4,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 9,
        userId: 4,
        status: 'pending'
      },
      // User 5
      {
        eventId: 5,
        userId: 5,
        status: 'attending'
      },
      {
        eventId: 8,
        userId: 5,
        status: 'attending'
      },
      {
        eventId: 10,
        userId: 5,
        status: 'waitlist'
      },
      // User 6
      {
        eventId: 6,
        userId: 6,
        status: 'attending'
      },
      // User 7
      {
        eventId: 7,
        userId: 7,
        status: 'attending'
      },
      {
        eventId: 12,
        userId: 7,
        status: 'attending'
      },
      // User 8
      {
        eventId: 8,
        userId: 8,
        status: 'attending'
      },
      {
        eventId: 14,
        userId: 8,
        status: 'pending'
      },
      // User 9
      {
        eventId: 9,
        userId: 9,
        status: 'attending'
      },
      {
        eventId: 11,
        userId: 9,
        status: 'attending'
      },
      {
        eventId: 13,
        userId: 9,
        status: 'attending'
      },
      // User 10
      {
        eventId: 10,
        userId: 10,
        status: 'attending'
      },
      {
        eventId: 12,
        userId: 10,
        status: 'pending'
      },
      // User 11
      {
        eventId: 15,
        userId: 11,
        status: 'attending'
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
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,2] }
    }, {});
  }
};
