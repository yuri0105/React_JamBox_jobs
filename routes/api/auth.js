const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { findUserByEmail, findUserByEmail1 } = require('../../model/User');
const config = require('../../config/global');
const sendEmail = require('../../utils/sendEmail');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        findUserByEmail(req.user.email)
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
                res.status(500).send(' Server Error');
            });

    } catch (err) {
        console.error(err.message);
        res.status(500).send(' Server Error');
    }
});


// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
// Login

router.post(
    '/',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            findUserByEmail1(email)
                .then((user) => {
                    if (!user) {
                        return res
                            .status(400)
                            .json({ errors: [{ msg: 'Invalid Credentials' }] });
                    }

                    bcrypt.compare(password, user.password)
                        .then((isMatch) => {
                            if (!isMatch) {
                                return res
                                    .status(400)
                                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
                            }
        
                            const payload = {
                                user: {
                                    email: user.email
                                }
                            };
        
                            jwt.sign(
                                payload,
                                config.jwtSecret,
                                { expiresIn: '5 days' },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({ token });
                                }
                            );
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).send('Server error');
                        })
                })
                .catch((err) => {
                    res.status(500).send('Server error');
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route    GET api/auth/forget
// @desc     Get user by token
// @access   Public

router.post('/forget', async (req, res) => {
    try {
        findUserByEmail(req.body.email)
            .then((user) => {
                // res.json(user);
                const payload = {
                    user: {
                        email: user.email
                    }
                };

                jwt.sign(
                    payload,
                    config.jwtSecret,
                    { expiresIn: '5 days' },
                    (err, token) => {
                        if (err) throw err;
                        sendEmail(user.email, "Reset password", token);
                        res.json({ token });
                    }
                );
            })
            .catch((err) => {
                res.status(500).send(' Server Error');
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(' Server Error');
    }
});


module.exports = router;
