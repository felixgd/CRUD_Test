let router = require('express').Router();
let BookLoanCtrl = require('../../controllers/bookloan.ctrl');
let auth = require('../auth');
let passport = require('passport');
let { check, validationResult } = require('express-validator/check');

router.post('/create', auth.required, [
  check('bookloan.shouldReturnAt').trim().escape().toDate(),
  check('bookloan.customerID').trim().escape().isAlphanumeric()
],BookLoanCtrl.createBookLoan);

router.post('/edit/:customerID/:bookLoanID', auth.required, [
  check('bookloan.shouldReturnAt').trim().escape().toDate()
  ],BookLoanCtrl.editBookLoan);

router.post('/complete/:customerID/:bookLoanID', auth.required, BookLoanCtrl.completeLoan);

router.delete('/delete/:customerID/:bookLoanID/:bookBarCode', auth.required, BookLoanCtrl.deleteBookFromLoan);
router.delete('/delete/:customerID/:bookLoanID', auth.required, BookLoanCtrl.deleteBookLoan);

router.get('/:customerID', auth.required, BookLoanCtrl.getCustomerLoans);
router.get('/:customerID/:bookLoanID', auth.required, BookLoanCtrl.findSpecificBookLoan);


module.exports = router;