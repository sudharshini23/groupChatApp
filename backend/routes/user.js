const express = require('express');

const router = express.Router();

const signupController = require('../controllers/signup');
const loginController = require('../controllers/login');

router.post('/signup', signupController.postSignUp);
router.post('/login', loginController.postLogin);

module.exports = router;