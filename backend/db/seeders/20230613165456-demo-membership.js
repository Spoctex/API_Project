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
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      // User 1 memberships
      {
        userId: 1,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 1,
        groupId: 2,
        status: 'member'
      },
      {
        userId: 1,
        groupId: 5,
        status: 'co-host'
      },
      {
        userId: 1,
        groupId: 9,
        status: 'pending'
      },
      {
        userId: 1,
        groupId: 11,
        status: 'co-host'
      },

      // User 2 memberships
      {
        userId: 2,
        groupId: 2,
        status: 'member'
      },
      {
        userId: 2,
        groupId: 4,
        status: 'member'
      },
      {
        userId: 2,
        groupId: 7,
        status: 'pending'
      },
      {
        userId: 2,
        groupId: 8,
        status: 'co-host'
      },
      {
        userId: 2,
        groupId: 10,
        status: 'member'
      },

      // User 3 memberships
      {
        userId: 3,
        groupId: 3,
        status: 'member'
      },
      {
        userId: 3,
        groupId: 6,
        status: 'pending'
      },
      {
        userId: 3,
        groupId: 9,
        status: 'co-host'
      },
      {
        userId: 3,
        groupId: 11,
        status: 'member'
      },
      {
        userId: 3,
        groupId: 1,
        status: 'member'
      },

      // User 4 memberships
      {
        userId: 4,
        groupId: 4,
        status: 'member'
      },
      {
        userId: 4,
        groupId: 7,
        status: 'member'
      },
      {
        userId: 4,
        groupId: 8,
        status: 'pending'
      },
      {
        userId: 4,
        groupId: 10,
        status: 'member'
      },
      {
        userId: 4,
        groupId: 2,
        status: 'pending'
      },

      // User 5 memberships
      {
        userId: 5,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 5,
        groupId: 9,
        status: 'member'
      },
      {
        userId: 5,
        groupId: 11,
        status: 'pending'
      },
      {
        userId: 5,
        groupId: 6,
        status: 'member'
      },
      {
        userId: 5,
        groupId: 4,
        status: 'member'
      },

      // User 6 memberships
      {
        userId: 6,
        groupId: 3,
        status: 'member'
      },
      {
        userId: 6,
        groupId: 6,
        status: 'member'
      },
      {
        userId: 6,
        groupId: 7,
        status: 'pending'
      },
      {
        userId: 6,
        groupId: 7,
        status: 'co-host'
      },
      {
        userId: 6,
        groupId: 10,
        status: 'member'
      },

      // User 7 memberships
      {
        userId: 7,
        groupId: 4,
        status: 'pending'
      },
      {
        userId: 7,
        groupId: 7,
        status: 'member'
      },
      {
        userId: 7,
        groupId: 8,
        status: 'member'
      },
      {
        userId: 7,
        groupId: 11,
        status: 'member'
      },
      {
        userId: 7,
        groupId: 8,
        status: 'member'
      },

      // User 8 memberships
      {
        userId: 8,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 8,
        groupId: 5,
        status: 'pending'
      },
      {
        userId: 8,
        groupId: 9,
        status: 'member'
      },
      {
        userId: 8,
        groupId: 2,
        status: 'pending'
      },
      {
        userId: 8,
        groupId: 5,
        status: 'member'
      },

      // User 9 memberships
      {
        userId: 9,
        groupId: 2,
        status: 'pending'
      },
      {
        userId: 9,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 9,
        groupId: 10,
        status: 'member'
      },
      {
        userId: 9,
        groupId: 1,
        status: 'co-host'
      },
      {
        userId: 9,
        groupId: 6,
        status: 'member'
      },

      // User 10 memberships
      {
        userId: 10,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 10,
        groupId: 3,
        status: 'member'
      },
      {
        userId: 10,
        groupId: 9,
        status: 'member'
      },
      {
        userId: 10,
        groupId: 5,
        status: 'pending'
      },
      {
        userId: 10,
        groupId: 2,
        status: 'member'
      },

      // User 11 memberships
      {
        userId: 11,
        groupId: 2,
        status: 'member'
      },
      {
        userId: 11,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 11,
        groupId: 10,
        status: 'member'
      },
      {
        userId: 11,
        groupId: 9,
        status: 'member'
      },
      {
        userId: 11,
        groupId: 10,
        status: 'pending'
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
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,2] }
    }, {});
  }
};
