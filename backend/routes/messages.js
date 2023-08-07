const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messages');
const authenticator = require('../middleware/authentication');

router.post('/send', authenticator.authenticate, messageController.saveMessage);
router.get('/fetchNewMsgs', messageController.fetchNewMessages);

module.exports = router;