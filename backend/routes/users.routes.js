const express = require('express');
const router = express.Router();
const db = require('../models');

const {isAuth, isAdmin, getMe, getAll, logIn, register, becomePriviliged, upDateName} = db.users;


router.get('/',isAuth, isAdmin, getAll);
router.get('/login', logIn);
router.post('/register',register);
router.get('/me', isAuth, getMe);
router.patch('/update-my-name',isAuth, upDateName);
/**
 * become priviliged req.body = {"privilige": {{"contentCreator" || "moderator" || etc.}}}
 * if endpoint hit when privilige is already added; the privilige is removed
 */
router.patch('/become-priviliged', isAuth, becomePriviliged);

module.exports = router;