const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, User, sequelize } = require('../../db/models');

const router = express.Router();


router.get('/', async (req, res) => {
    //test
    let Groups = await Group.findAll();
    for (let i = 0; i < Groups.length;i++){
        let mmbrs = await Groups[i].countUsers();
        let prevImg = await Groups[i].getGroupImages({where:{preview:true}});
        Groups[i] = Groups[i].toJSON();
        Groups[i].numMembers = mmbrs;
        if(prevImg[0]) Groups[i].previewImage = prevImg[0].url;
    }
    res.json({ Groups })
});









module.exports = router;
