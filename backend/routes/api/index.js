const router = require('express').Router();
// GET /api/restore-user
const { restoreUser, requireAuth } = require('../../utils/auth.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const { GroupImage, EventImage } = require('../../db/models')


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

router.delete('/group-images/:id', requireAuth, async (req, res, next) => {
    let img = await GroupImage.findByPk(req.params.id);
    if (!img) {
        let err = new Error('Group Image could not be found');
        err.status = 404;
        return next(err);
    }
    let group = await img.getGroup();
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
    await img.destroy();
    return res.json({ message: 'Successfully deleted' });
});

router.delete('/event-images/:id', requireAuth, async (req, res, next) => {
    let img = await EventImage.findByPk(req.params.id);
    if (!img) {
        let err = new Error('Event Image could not be found');
        err.status = 404;
        return next(err);
    }
    let event = await img.getEvent();
    let group = await event.getGroup();
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
    await img.destroy();
    return res.json({ message: 'Successfully deleted' });
});

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});


module.exports = router;
