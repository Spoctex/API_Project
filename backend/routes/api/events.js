const express = require('express');
const { check } = require('express-validator');
const { validStates, handleValidationErrors, requireAuth, groupEnums } = require('../../utils')
const { Event, Group, Venue } = require('../../db/models');

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
        let attending = invited.filter(async (user) => user.Attendance.status === "attending")
        if (previewImage[0]) event.dataValues.previewImage = previewImage[0].url;
        event.dataValues.attending = attending.length;
    }));
    res.json({ Events })
});

// router.get('/:id', async (req, res, next) => {
//     let event = await Event.findByPk(req.params.id);
//     if (!event){
//         let err = new Error('Event could not be found');
//         err.status = 404;
//         return next(err);
//     };

//     res.json(event);
// });





module.exports = router;
