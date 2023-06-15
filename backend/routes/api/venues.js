const express = require('express');
const { check } = require('express-validator');
const { validStates, handleValidationErrors, requireAuth } = require('../../utils')
const { Venue } = require('../../db/models');

const router = express.Router();


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

router.put('/:id', [requireAuth, validateNewVenue], async (req, res, next) => {
    let venue = await Venue.findByPk(req.params.id);
    if (!venue) {
        let err = new Error('Venue could not be found');
        err.status = 404;
        return next(err);
    }
    let group = await venue.getGroup();
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
    venue.address =address;
    venue.city =city;
    venue.state =state;
    venue.lat =lat;
    venue.lng =lng;
    await venue.save();
    venue = venue.toJSON();
    delete venue.updatedAt
    return res.json(venue)
});









module.exports = router;
