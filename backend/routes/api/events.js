const express = require('express');
const { check } = require('express-validator');
const { validStates, handleValidationErrors, requireAuth, groupEnums } = require('../../utils')
const { Event, Group, Venue, EventImage } = require('../../db/models');

const router = express.Router();


router.get('/', async (_req, res) => {
    let Events = await Event.findAll({
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
        let previewImage = await event.getEventImages({ where: { preview: true }, attributes: ['url'] });
        let invited = await event.getUsers();
        let attending = invited.filter(async (user) => user.Attendance.status === "attending");
        if (previewImage[0]) event.dataValues.previewImage = previewImage[0].url;
        event.dataValues.attending = attending.length;
    }));
    res.json({ Events })
});

router.get('/:id', async (req, res, next) => {
    let event = await Event.findByPk(req.params.id, {
        include: [{
            model: Group,
            attributes: ['id', 'name', 'private', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
        }, {
            model: EventImage
        }]
    });
    if (!event) {
        let err = new Error('Event could not be found');
        err.status = 404;
        return next(err);
    };
    let invited = await event.getUsers();
    let attending = invited.filter(async (user) => user.Attendance.status === "attending")
    event.dataValues.attending = attending.length;
    res.json(event);
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
    let event = await Event.findByPk(req.params.id);
    if (!event) {
        let err = new Error('Event could not be found');
        err.status = 404;
        return next(err);
    };
    let group = await event.getGroup();
    let cohosts = await group.getUsers();
    cohosts = cohosts.reduce((acc, mmbr) => {
        if (mmbr.Membership.status === 'co-host') {
            acc.push(mmbr.id);
        }
        return acc;
    }, []);
    let invited = await event.getUsers();
    let attending = invited.reduce((acc, user) => {
        if (user.Attendance.status === "attending"){
            acc.push(user.id);
        }
        return acc;
    }, []);
    if (![group.organizerId, ...cohosts, ...attending].includes(req.user.id)) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group host, a co-host, or an attendee' };
        err.status = 403;
        return next(err);
    }
    let {url, preview} = req.body;
    let newImg = await event.createEventImage({url,preview});
    delete newImg.dataValues.eventId;
    delete newImg.dataValues.updatedAt;
    delete newImg.dataValues.createdAt;
    res.json(newImg);
});



module.exports = router;
