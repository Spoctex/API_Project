const express = require('express');
const { check } = require('express-validator');
const { groupEnums, validStates, handleValidationErrors, requireAuth, eventEnums } = require('../../utils')
const { Group, Event, Venue, Membership } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();


router.get('/current', requireAuth, async (req, res) => {
    let Groups = await req.user.getGroups();
    for (let i = 0; i < Groups.length; i++) {
        let mmbrs = await Groups[i].countUsers();
        let prevImg = await Groups[i].getGroupImages({ where: { preview: true } });
        Groups[i] = Groups[i].toJSON();
        Groups[i].numMembers = mmbrs;
        if (prevImg[0]) Groups[i].previewImage = prevImg[0].url;
    }
    return res.json({ Groups })
});

const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 30 })
        .withMessage('Please provide a valid name no more than 30 characters long.'),
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
        .isIn(validStates)
        .withMessage('Please provid a valid state (provide like "NY" or "AK")'),
    handleValidationErrors
];

router.post('/', [requireAuth, validateNewGroup], async (req, res) => {
    let { name, about, type, private, city, state } = req.body;
    let newGroup = await Group.create({
        name, type, private, city, state, about,
        organizerId: req.user.id
    });
    res.status(201);
    return res.json(newGroup);
});

router.put('/:id', [requireAuth, validateNewGroup], async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    if (group.organizerId !== req.user.id) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group owner' };
        err.status = 403;
        return next(err);
    }
    let { name, about, type, private, city, state } = req.body;
    group.name = name;
    group.about = about;
    group.type = type;
    group.private = private;
    group.city = city;
    group.state = state;
    await group.save();
    return res.json(group);
});

router.get('/', async (_req, res) => {
    let Groups = await Group.findAll();
    for (let i = 0; i < Groups.length; i++) {
        let mmbrs = await Groups[i].countUsers();
        let previewImg = await Groups[i].getGroupImages({ where: { preview: true } });
        Groups[i] = Groups[i].toJSON();
        if (previewImg[0]) Groups[i].previewImage = previewImg[0].url;
        Groups[i].numMembers = mmbrs;
    }
    return res.json({ Groups })
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
    return res.json(group)
});

router.delete('/:id', requireAuth, async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    if (group.organizerId !== req.user.id) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group owner' };
        err.status = 403;
        return next(err);
    }
    await group.destroy();
    return res.json({ message: 'Successfully deleted' })
});

const validateNewImage = [
    check('url')
        .exists({ checkFalsy: true })
        .isURL()
        .withMessage('Please provide valid image url.'),
    check('preview')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage('Please indicate wether this is a preview image (true or false only).'),
    handleValidationErrors
];

router.post('/:id/images', [requireAuth, validateNewImage], async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    if (group.organizerId !== req.user.id) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group owner' };
        err.status = 403;
        return next(err);
    }
    let { url, preview } = req.body;
    let img = await group.createGroupImage({ url, preview });
    img = img.toJSON();
    let rtrnImg = {};
    rtrnImg.id = img.id;
    rtrnImg.url = img.url;
    rtrnImg.preview = img.preview;
    return res.json(rtrnImg);
});

router.get('/:id/venues', requireAuth, async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    let cohosts = await group.getUsers();
    cohosts = cohosts.reduce((acc, mmbr) => {
        if (mmbr.Membership.status === 'co-host') {
            acc.push(mmbr.id);
        }
        return acc;
    }, [])
    if (![group.organizerId, ...cohosts].includes(req.user.id)) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group owner or a co-host' };
        err.status = 403;
        return next(err);
    }
    let venues = await group.getVenues();
    return res.json(venues);
});

const validateNewVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid address'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid city.'),
    check('state')
        .exists({ checkFalsy: true })
        .isIn(validStates)
        .withMessage('Please provid a valid state (provide like "NY" or "AK")'),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Longitude is not valid'),
    handleValidationErrors
];

router.post('/:id/venues', [requireAuth, validateNewVenue], async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    let cohosts = await group.getUsers();
    cohosts = cohosts.reduce((acc, mmbr) => {
        if (mmbr.Membership.status === 'co-host') {
            acc.push(mmbr.id);
        }
        return acc;
    }, [])
    if (![group.organizerId, ...cohosts].includes(req.user.id)) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group owner or a co-host' };
        err.status = 403;
        return next(err);
    }
    let { address, city, state, lat, lng } = req.body;
    let newVenue = await group.createVenue({ address, city, state, lat, lng })
    let rtrnVenue = {};
    rtrnVenue.id = newVenue.id;
    rtrnVenue.groupId = newVenue.groupId;
    rtrnVenue.address = newVenue.address;
    rtrnVenue.city = newVenue.city;
    rtrnVenue.state = newVenue.state;
    rtrnVenue.lat = newVenue.lat;
    rtrnVenue.lng = newVenue.lng;
    return res.json(rtrnVenue)
});

router.get('/:id/events', async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    };
    let Events = await group.getEvents({
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }]
    });
    await Promise.all(Events.map(async (event) => {
        if (event.price) {
            let price = event.price.toString().split('.');
            if (price[1].length < 2) {
                while (price[1].length < 2) price[1] += '0';
            }
            event.price = price.join('.');
        }
        let previewImage = await event.getEventImages({ where: { preview: true }, attributes: ['url'] });
        let invited = await event.getUsers();
        let attending = invited.filter(async (user) => user.Attendance.status === "attending");
        if (previewImage[0]) event.dataValues.previewImage = previewImage[0].url;
        event.dataValues.attending = attending.length;
    }));
    return res.json({ Events });
});

const validateNewEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a venue')
        .custom(async (value, { req }) => {
            let venue = await Venue.findByPk(value);
            if (!venue) throw new Error('Venue does not exist');
        }),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(eventEnums)
        .withMessage(`Type must be ${eventEnums.join(' or ')}`),
    check('capacity')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage('capacity must be an integer'),
    check('price')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Price must be decimal')
        .custom(async (value, { req }) => {
            value = value.toString().split('.');
            if (value[1].length > 2 || Number(value[0]) < 0) throw new Error('Please provide a valid price');
        }),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('Start date required')
        .custom(async (value, { req }) => {
            try {
                value = new Date(value);
            } catch { throw new Error('Please provide a valid date') }
            let start = value.getTime();
            let now = new Date();
            now = now.getTime();
            if (!(start > now)) throw new Error('Start date must be in the future');
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date required')
        .custom(async (value, { req }) => {
            try {
                value = new Date(value);
            } catch { throw new Error('Please provide a valid end date') }
            let end = value.getTime();
            let start;
            try {
                start = new Date(req.body.startDate);
            } catch { throw new Error('Please provide a valid start date') }
            start = start.getTime();
            if (!(end > start)) throw new Error('End date must be after the start date');
        }),
    handleValidationErrors
];

router.post('/:id/events', [requireAuth, validateNewEvent], async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    let cohosts = await group.getUsers();
    cohosts = cohosts.reduce((acc, mmbr) => {
        if (mmbr.Membership.status === 'co-host') {
            acc.push(mmbr.id);
        }
        return acc;
    }, [])
    if (![group.organizerId, ...cohosts].includes(req.user.id)) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group owner or a co-host' };
        err.status = 403;
        return next(err);
    }
    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    price = price.toString().split('.');
    if (price[1].length < 2) {
        while (price[1].length < 2) price[1] += '0';
    }
    price = price.join('.');
    let newEvent = await group.createEvent({ venueId, name, type, capacity, price, description, startDate, endDate });
    delete newEvent.dataValues.createdAt;
    delete newEvent.dataValues.updatedAt;
    return res.json(newEvent);
});

router.get('/:id/members', async (req, res) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    let cohosts = await group.getUsers();
    cohosts = cohosts.reduce((acc, mmbr) => {
        if (mmbr.Membership.status === 'co-host') {
            acc.push(mmbr.id);
        }
        return acc;
    }, [])
    let auth = false;
    if (req.user && [group.organizerId, ...cohosts].includes(req.user.id)) {
        auth = true;
    }
    let members = await group.getUsers({
        attributes: {
            exclude:
                ['username']
        }
    });
    members = members.reduce((acc, mmbr) => {
        mmbr = mmbr.toJSON();
        delete mmbr.Membership["groupId"];
        delete mmbr.Membership.userId;
        acc.push(mmbr);
        if (!auth && mmbr.Membership.status === 'left') acc.pop();
        return acc;
    }, []);
    return res.json(members);
});

router.post('/:id/membership', requireAuth, async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error('Group could not be found');
        err.status = 404;
        return next(err);
    }
    let members = await group.getUsers();
    let membersId = members.map(mmbr => mmbr.id);
    console.log(req.user.id, group.organizerId, membersId)
    if ([group.organizerId, ...membersId].includes(req.user.id)) {
        console.log('is member')
        let err = new Error('User is already a part of the group');
        err.status = 400;
        for (let i = 0; i < members.length; i++) {
            if (members[i].Membership.userId === req.user.id && members[i].Membership.status === 'left') {
                err.message = 'Membership has already been requested';
                break;
            }
        }
        return next(err);
    }
    let memReq = await Membership.create({
        userId: req.user.id,
        groupId: group.id,
        status: 'left'
    });
    return res.json({
        memberId: req.user.id,
        status: 'pending'
    });
});







module.exports = router;
