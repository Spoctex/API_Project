const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const states = require('../../utils/validStates');
const { groupEnums } = require('../../utils/validEnumArrays')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, User, sequelize } = require('../../db/models');

const router = express.Router();



router.get('/current', async (req, res) => {
    let Groups = await req.user.getGroups();
    for (let i = 0; i < Groups.length; i++) {
        let mmbrs = await Groups[i].countUsers();
        let prevImg = await Groups[i].getGroupImages({ where: { preview: true } });
        Groups[i] = Groups[i].toJSON();
        Groups[i].numMembers = mmbrs;
        if (prevImg[0]) Groups[i].previewImage = prevImg[0].url;
    }
    res.json({ Groups })
});

const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage('Please provide a valid name no more than 60 characters long.'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('private')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage('Please indicate wether group is private (true or false only).'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid city.'),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(groupEnums)
        .withMessage(`Your group type should be ${groupEnums.join(' or ')}`),
    check('state')
        .exists({ checkFalsy: true })
        .isIn(states)
        .withMessage('Please provid a valid state (provide like "NY" or "AK")'),
    handleValidationErrors
];

router.post('/', validateNewGroup, async (req, res) => {
    let { name, about, type, private, city, state } = req.body;
    console.log({ name, type, private, city, state, about })
    let newGroup = await Group.create({ name, type, private, city, state, about,
        organizerId: req.user.id
    });
    return res.json(newGroup);
});

router.get('/', async (req, res) => {
    let Groups = await Group.findAll();
    for (let i = 0; i < Groups.length; i++) {
        let mmbrs = await Groups[i].countUsers();
        let previewImg = await Groups[i].getGroupImages({ where: { preview: true } });
        Groups[i] = Groups[i].toJSON();
        if (previewImg[0]) Groups[i].previewImage = previewImg[0].url;
        Groups[i].numMembers = mmbrs;
    }
    res.json({ Groups })
});

router.get('/:id', async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    let imgs = await group.getGroupImages({
        attributes: ['id', 'url', 'preview']
    });
    let organizer = await group.getUsers({
        where: { id: group.id },
        attributes: ['id', 'firstName', 'lastName']
    });
    let venues = await group.getVenues({
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });
    let mmbrs = await group.countUsers();
    group = group.toJSON();
    group.numMembers = mmbrs;
    group.GroupImages = imgs;
    group.Organizer = organizer;
    group.Venues = venues;
    res.json(group)
})









module.exports = router;
