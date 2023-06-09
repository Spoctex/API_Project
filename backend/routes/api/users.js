const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors, setTokenCookie } = require('../../utils');

const { User } = require('../../db/models');

const router = express.Router();


const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('email')
        .custom(async (value, { req }) => {
            let search = await User.findOne({ where: { email: value } });
            if (search) throw new Error('Email already in use');
        }),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('username')
        .custom(async (value, { req }) => {
            let search = await User.findOne({ where: { username: value } });
            if (search) throw new Error('Username already in use');
        }),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 3 })
        .withMessage('Please provide a first name with at least 3 letters'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 3 })
        .withMessage('Please provide a last name with at least 3 letters'),
    handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
        const { email, password, username, firstName, lastName } = req.body;
        // let search = await User.findOne({ where: { email } });
        // if (search) {
        //     let err = new Error('Email already in use');
        //     err.status = 500;
        //     return next(err);
        // }
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ firstName, lastName, email, username, hashedPassword });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);





module.exports = router;
