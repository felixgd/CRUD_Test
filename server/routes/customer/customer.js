'use strict';

let router = require('express').Router();
let CustomerCtrl = require('../../controllers/customer.ctrl');
let auth = require('../auth');
let passport = require('passport');
let { check, validationResult } = require('express-validator/check');
router.post('/create', auth.required, [
  check('customer.email').isEmail().normalizeEmail(),
  check('customer.firstName').trim().escape().isAlpha(),
  check('customer.secondName').trim().escape().isAlpha(),
  check('customer.lastName').trim().escape().isAlpha(),
  check('customer.ID').trim().escape().isAlphanumeric()
],CustomerCtrl.createCustomer);

router.post('/edit', auth.required, [
    check('customer.email').isEmail().normalizeEmail(),
    check('customer.firstName').trim().escape().isAlpha(),
    check('customer.secondName').trim().escape().isAlpha(),
    check('customer.lastName').trim().escape().isAlpha(),
    check('customer.ID').trim().escape().isAlphanumeric()
  ],CustomerCtrl.editCustomer);

router.delete('/delete/:ID', auth.required, CustomerCtrl.deleteCustomer);

router.get('/:ID', auth.required, CustomerCtrl.findCustomer);
router.get('/', auth.required, CustomerCtrl.getAllCustomers);

module.exports = router;