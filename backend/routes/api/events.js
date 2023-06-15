const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors, requireAuth, eventEnums } = require('../../utils')
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
            console.log(Number(value[0])<0)
            if (value[1].length > 2 || Number(value[0]) < 0) throw new Error('Please provide a valid price')
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

router.put('/:id',[requireAuth,validateNewEvent],async(req,res,next)=>{
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
    if (![group.organizerId, ...cohosts].includes(req.user.id)) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Can only be done by the group host or a co-host' };
        err.status = 403;
        return next(err);
    }
    let {venueId,name,type,capacity,price,description,startDate,endDate} = req.body;
    event.venueId =venueId;
    event.name =name;
    event.type =type;
    event.capacity =capacity;
    event.price =price;
    event.description =description;
    event.startDate =startDate;
    event.endDate =endDate;
    await event.save();
    delete event.dataValues.updatedAt;
    res.json(event);
});





module.exports = router;
