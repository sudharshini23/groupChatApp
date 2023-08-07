const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/signup', userController.addUser);
router.post('/login', userController.logUser);

// const signupController = require('../controllers/signup');
// const loginController = require('../controllers/login');
// const msgController = require('../controllers/message');
// const msgAuth = require('../middleware/authentication');

// router.post('/signup', signupController.postSignUp);
// router.post('/login', loginController.postLogin);
// router.post('/message', msgAuth.authenticate, msgController.postMessage)
// router.get('/get-message', msgAuth.authenticate, msgController.getMessage)

module.exports = router;