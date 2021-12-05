const express = require('express');
const router = express.Router();
const db = require('../models');

const {isAuth, getMe, logIn, register, becomePriviliged, upDateName} = db.users;

router.get('/login', logIn);
router.post('/register',register);
router.get('/me', isAuth, getMe);
router.put('/update-my-name',isAuth, upDateName);
router.patch('/become-priviliged', isAuth, becomePriviliged);
