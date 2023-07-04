'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'johndoe@example.com',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'janesmith@example.com',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        username: 'michaelj',
        email: 'michaeljohnson@example.com',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Emily',
        lastName: 'Brown',
        username: 'emilyb',
        email: 'emilybrown@example.com',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        username: 'davidw',
        email: 'davidwilson@example.com',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Sarah',
        lastName: 'Taylor',
        username: 'saraht',
        email: 'sarahtaylor@example.com',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: 'Matthew',
        lastName: 'Anderson',
        username: 'matthewa',
        email: 'matthewanderson@example.com',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        firstName: 'Olivia',
        lastName: 'Thomas',
        username: 'oliviat',
        email: 'oliviathomas@example.com',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        firstName: 'James',
        lastName: 'Jackson',
        username: 'jamesj',
        email: 'jamesjackson@example.com',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        firstName: 'Emma',
        lastName: 'White',
        username: 'emmaw',
        email: 'emmawhite@example.com',
        hashedPassword: bcrypt.hashSync('password10')
      },
      {
        firstName: 'Daniel',
        lastName: 'Miller',
        username: 'danielm',
        email: 'danielmiller@example.com',
        hashedPassword: bcrypt.hashSync('password11')
      },
      {
        firstName: 'firstName1',
        lastName: 'lastName1',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'firstName2',
        lastName: 'lastName2',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'firstName3',
        lastName: 'lastName3',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
