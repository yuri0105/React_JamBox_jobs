const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const { registerUser } = require('../../model/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
    '/',
    check('fullname', 'Fullname is required').notEmpty(),
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        registerUser(req.body, res);
        // res.json({success: "true"});
    }
);

module.exports = router;