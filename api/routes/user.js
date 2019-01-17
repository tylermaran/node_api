const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const CheckAuth = require('../middleware/check-auth');

// creating two user routes: Signup and Signin
// this will be users/signup or users/signin - path created in app.js 
router.post('/signup', UserController.user_signup);

// Login route
router.post('/login', UserController.user_login);

// Delete users
router.delete('/:userId', CheckAuth, UserController.user_delete);

module.exports = router;