let router = require('express').Router();
let BookCtrl = require('../../controllers/book.ctrl');
let auth = require('../auth');
let passport = require('passport');
let Book = require('../../models/book');
let { check, validationResult } = require('express-validator/check');
router.post('/add', auth.required, [
  check('book.name').trim().escape().isAlpha(),
  check('book.barCode').trim().escape().isAlpha(),
  check('book.qty').trim().escape().isInt(),
  check('book.publisher').trim().escape().isAlphanumeric(),
  check('book.author').trim().escape().isAlphanumeric(),
  check('book.categories').trim().escape().isAlphanumeric()
],BookCtrl.addBook);

router.post('/edit', auth.required, [
    check('book.name').trim().escape().isAlpha(),
    check('book.barCode').trim().escape().isAlpha(),
    check('book.qty').trim().escape().isInt(),
    check('book.publisher').trim().escape().isAlphanumeric(),
    check('book.author').trim().escape().isAlphanumeric(),
    check('book.categories').trim().escape().isAlphanumeric()
  ],BookCtrl.editBook);
router.delete('/delete/:barCode', auth.required, BookCtrl.deleteBook);
router.get('/toLoan', auth.required, BookCtrl.getAllBooksReadyToLoan);
router.get('/:barCode', auth.required, BookCtrl.findBook);
router.get('/', auth.required, BookCtrl.getAllBooks);

module.exports = router;