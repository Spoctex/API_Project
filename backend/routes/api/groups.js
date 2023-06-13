const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, User, sequelize } = require('../../db/models');
const { nextTick } = require('process');

const router = express.Router();



router.get('/current', async(req,res)=>{
    let Groups = await req.user.getGroups();
    for (let i = 0; i < Groups.length; i++) {
        let mmbrs = await Groups[i].countUsers();
        let prevImg = await Groups[i].getGroupImages({ where: { preview: true } });
        Groups[i] = Groups[i].toJSON();
        Groups[i].numMembers = mmbrs;
        if (prevImg[0]) Groups[i].previewImage = prevImg[0].url;
    }
    res.json({ Groups })
})

router.get('/', async (req, res) => {
    let Groups = await Group.findAll();
    for (let i = 0; i < Groups.length; i++) {
        let mmbrs = await Groups[i].countUsers();
        let prevImg = await Groups[i].getGroupImages({ where: { preview: true } });
        Groups[i] = Groups[i].toJSON();
        Groups[i].numMembers = mmbrs;
        if (prevImg[0]) Groups[i].previewImage = prevImg[0].url;
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
