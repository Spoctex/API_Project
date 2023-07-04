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
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId:1,
        url:'https://static1.squarespace.com/static/5c7be58cb7c92c5aeea73009/t/61528307cf0ef0390a9ab821/1663967380288/The-hiking-club-community-group-640x334.png?format=1500w',
        preview:true
      },
      {
        groupId:2,
        url:'https://www.rd.com/wp-content/uploads/2022/11/GettyImages-1389876065.jpg',
        preview:true
      },
      {
        groupId:3,
        url:'https://lifeprintphotos.com/cdn/shop/articles/c707a55f1ce046d94c115c5cca8dafc1.png?v=1614804698',
        preview:true
      },
      {
        groupId:4,
        url:'https://www.thefitnessclub.net/assets/TheFitnessClub__signature-membership-image.png',
        preview:true
      },
      {
        groupId:5,
        url:'https://bloximages.newyork1.vip.townnews.com/oudaily.com/content/tncms/assets/v3/editorial/f/0d/f0d2c5d8-54fd-11ea-ba2f-2f3fc0b081a0/5e506107324c3.image.jpg?crop=1000%2C525%2C0%2C71&resize=1000%2C525&order=crop%2Cresize',
        preview:true
      },
      {
        groupId:6,
        url:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/18/dc/e7/caption.jpg?w=1200&h=1200&s=1',
        preview:true
      },
      {
        groupId:7,
        url:'https://www.greenvilleonline.com/gcdn/presto/2021/10/11/PGRE/46363dea-705c-4d97-a737-9df596142879-1021_TG_CookingClubGVL_01.JPG?crop=2999,1687,x1,y66&width=2999&height=1687&format=pjpg&auto=webp',
        preview:true
      },
      {
        groupId:8,
        url:'https://filmfreeway-production-storage-01-storage.filmfreeway.com/festivals/logos/000/069/272/large/logo.jpg?1666201065',
        preview:true
      },
      {
        groupId:9,
        url:'https://imageio.forbes.com/specials-images/imageserve/608c0fe688912a34116050b2/Businesswomen-is-holding-finger-poised-over-her-smartpjone--In-an-arc-around-the/960x0.jpg?format=jpg&width=960',
        preview:true
      },
      {
        groupId:10,
        url:'https://domf5oio6qrcr.cloudfront.net/medialibrary/7402/b13043c1-a4ab-4115-8b25-e2f170c97d8d.jpg',
        preview:true
      },
      {
        groupId:11,
        url:'https://theaggie.org/wp-content/uploads/2019/10/DSC9552-scaled.jpg',
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.google.com/1','www.google.com/2','www.google.com/3'] }
    }, {});
  }
};
