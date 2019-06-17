'use strict';

let router = require('express').Router();
let UserCtrl = require('../../controllers/user.ctrl');
let auth = require('../auth');
let passport = require('passport');
let { check, validationResult } = require('express-validator/check');
router.post('/login', auth.optional, [
  check('user.email').isEmail().normalizeEmail(),
  check('user.password').trim().escape()
],UserCtrl.user_login);

router.post('/sign_up', auth.optional,[
  check('email').isEmail().normalizeEmail(),
  check('password').trim().escape(),
  check('username').trim().escape()
], UserCtrl.user_sign_up);


router.post('/resetpass', auth.optional, [
  check('email').isEmail().normalizeEmail(),
],UserCtrl.user_reset_password_token);

router.get('/reset/', auth.optional,UserCtrl.user_reset_password);

router.post('/reset/', auth.optional, [
  check('password').trim().escape(),
  check('repassword').trim().escape(),
],UserCtrl.user_update_reset_password);

router.get('/verification/:token', UserCtrl.user_verif);

module.exports = router;