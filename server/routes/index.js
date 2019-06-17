var express = require('express');
var router = express.Router();

router
    .use('/api/user', require('./user/user'))
    .use('/api/book', require('./book/book'))
    .use('/api/customer', require('./customer/customer'))
    .use('/api/bookloan', require('./bookloan/bookloan'));
module.exports = router;