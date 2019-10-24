const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const chechAuth = require('../middleware/check-auth');

router.get('/', chechAuth, UserController.user_get_all);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', chechAuth, UserController.user_delete);


module.exports = router;