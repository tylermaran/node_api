const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Create new user
exports.user_signup = (req, res, next) => {
    // checking to see if email address is unique
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(409).json({
                    message: 'Email Address already exists'
                })
                console.log("ERROR EMAIL MATCHES AN EXISTING ADDRESS");
            } else {
                console.log('You good man');
                // hashing the password: password in string form, number of hashing rounds
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) {
                            return res.status(500).json({
                                message: "error right here",
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            });
                            user.save().then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created'
                                });
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    message: 'error saving to database',
                                    error: err
                                });
                            })
                        }
                    });
                });
            }
        });
};

// Login User
exports.user_login = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth Failed'
                });
            } else {
                // user will be returned as type array - but only a single user (FindOne)
                console.log(user);
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: 'Auth Failed'
                        });
                    }
                    if (result) {
                        // result === true if a match
                        // Generate the web token
                        console.log(user);
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, process.env.JWT_KEY, {
                            expiresIn: '1h'
                        });
                        res.status(200).json({
                            message: 'Auth Successful',
                            token: token
                        });

                    } else {
                        res.status(401).json({
                            message: 'Auth Failed'
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// Delete user
exports.user_delete = (req, res, next) => {
    User.remove({
            _id: req.params.userId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted'
            });
        })
        .catch(err => {
            res.status(404).json({
                error: err
            });
        });
};