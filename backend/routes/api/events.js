const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors, requireAuth, eventEnums, attendEnums } = require('../../utils');
const { Event, Group, Venue, EventImage, Attendance, User } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();


const queryValidation = [
    check('size')
        .custom(async (_val, { req }) => {
            if (isNaN(req.query.size) && typeof req.query.size !== 'undefined') throw new Error('Size must be a number');
            if (Number(req.query.size) < 1) throw new Error('Size must be greater than or equal to 1');
            if (Number(req.query.size) > 20) throw new Error('Size must be less than or equal to 20');
        }),
    check('page')
        .custom(async (_val, { req }) => {
            if (isNaN(req.query.page) && typeof req.query.page !== 'undefined') throw new Error('Page must be a number');
            if (Number(req.query.page) < 1) throw new Error('Page must be greater than or equal to 1');
            if (Number(req.query.page) > 10) throw new Error('Page must be less than or equal to 10');
        }),
    handleValidationErrors
];

router.get('/', queryValidation, async (req, res) => {
    let { page, size } = req.query;
    let pagination = {};
    const defaultSize = 20;
    const defaultPage = 1;
    if (!page) page = defaultPage;
    if (!size) size = defaultSize;
    page = Math.round(page)
    size = Math.round(size)
    pagination.limit = size;
    pagination.offset = (page - 1) * size;
    console.log(pagination)
    let Events = await Event.findAll({
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }],
        ...pagination
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
        event.dataValues.numAttending = attending.length;
    }));







    return res.json({ Events })
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
    event.dataValues.numAttending = attending.length;
    if (event.price) {
        let price = event.price.toString().split('.');
        if (price[1].length < 2) {
            while (price[1].length < 2) price[1] += '0';
        }
        event.price = price.join('.');
    }
    return res.json(event);
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
        if (user.Attendance.status === "attending") {
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
    let { url, preview } = req.body;
    let newImg = await event.createEventImage({ url, preview });
    delete newImg.dataValues.eventId;
    delete newImg.dataValues.updatedAt;
    delete newImg.dataValues.createdAt;
    return res.json(newImg);
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
            console.log(Number(value[0]) < 0)
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

router.put('/:id', [requireAuth, validateNewEvent], async (req, res, next) => {
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
    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    event.venueId = venueId;
    event.name = name;
    event.type = type;
    event.capacity = capacity;
    event.price = price;
    event.description = description;
    event.startDate = startDate;
    event.endDate = endDate;
    await event.save();
    delete event.dataValues.updatedAt;
    return res.json(event);
});

router.delete('/:id', requireAuth, async (req, res, next) => {
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
    await event.destroy();
    return res.json({ message: 'Successfully deleted' });
});

router.get('/:id/attendees', async (req, res, next) => {
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
    let auth = false;
    if (req.user && [group.organizerId, ...cohosts].includes(req.user.id)) {
        auth = true;
    }
    let Attendees = await event.getUsers();
    Attendees = Attendees.reduce((acc, user) => {
        user = user.toJSON();
        delete user.Attendance.eventId;
        delete user.Attendance.userId;
        acc.push(user);
        if (!auth && user.Attendance.status === 'undecided') acc.pop();
        return acc;
    }, []);
    return res.json(Attendees);
});

router.post('/:id/attendance', requireAuth, async (req, res, next) => {
    let event = await Event.findByPk(req.params.id);
    if (!event) {
        let err = new Error('Event could not be found');
        err.status = 404;
        return next(err);
    };
    let group = await event.getGroup();
    let members = await group.getUsers();
    members = members.reduce((acc, mmbr) => {
        acc.push(mmbr.id);
        return acc;
    }, []);
    if (![group.organizerId, ...members].includes(req.user.id)) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required' };
        err.status = 403;
        return next(err);
    }
    let attendance = await Attendance.findOne({
        where: {
            [Op.and]: [{ userId: req.user.id }, { eventId: event.id }]
        }
    });
    if (attendance) {
        let err = new Error('Attendance has already been requested');
        err.status = 400;
        if (attendance.status !== 'undecided') err.message = 'Attendance has already been decided';
        return next(err);
    }
    await Attendance.create({
        userId: req.user.id,
        eventId: event.id,
        status: 'undecided'
    });
    return res.json({
        userId: req.user.id,
        //can change pending to undecided for consistency
        status: 'undecided'
    })
});

const validateAttendance = [
    check('userId')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage('Please provide a valid userId')
        .custom(async (val, { req }) => {
            let user = await User.findByPk(val);
            if (!user) throw new Error('User cannot be found');
        }),
    check('status')
        .exists({ checkFalsy: true })
        .isIn(attendEnums)
        .withMessage('Please provide at valid status like attending or not attending')
        .custom(async (val, { req }) => {
            if (val === 'pending' || val === 'undecided') throw new Error('Cannot change status to pending')
        }),
    handleValidationErrors
];

router.put('/:id/attendance', [requireAuth, validateAttendance], async (req, res, next) => {
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
    let attendance = await Attendance.findOne({
        where: {
                               //change to req.body.userId
            [Op.and]: [{ userId: req.body.userId }, { eventId: event.id }]
        },
        attributes: { include: ['id'] }
    });
    if (!attendance) {
        let err = new Error(`Attendance between user and event doesn't exist`);
        err.status = 404;
        return next(err);
    }
    attendance.status = req.body.status;
    attendance.save();
    return res.json({
        id: attendance.id,
        eventId: req.params.id,
        userId: req.user.id,
        status: req.body.status
    });
});

const findUser = [
    check('userId')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage('Please provide a valid userId')
        .custom(async (val, { req }) => {
            let user = await User.findByPk(val);
            if (!user) throw new Error('User cannot be found');
        }),
    handleValidationErrors
];

router.delete('/:id/attendance', [requireAuth, findUser], async (req, res, next) => {
    let event = await Event.findByPk(req.params.id);
    if (!event) {
        let err = new Error('Event could not be found');
        err.status = 404;
        return next(err);
    };
    let group = await event.getGroup();
    if (group.organizerId !== req.user.id && req.user.id !== req.body.userId) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden';
        err.errors = { message: 'Authorization required: Only the User or organizer may delete an attendance' };
        err.status = 403;
        return next(err);
    }
    let attendance = await Attendance.findOne({
        where: {
            [Op.and]: [{ userId: req.body.userId }, { eventId: event.id }]
        },
        attributes: { include: ['id'] }
    });
    if (!attendance) {
        let err = new Error(`Attendance between user and event doesn't exist`);
        err.status = 404;
        return next(err);
    }
    await attendance.destroy();
    return res.json({ message: 'Successfully deleted attendance from event' });

});





module.exports = router;
