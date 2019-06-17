require('dotenv').config();
let app = require('express')();
let express = require('express');
let path    = require("path");
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let index = require('./routes/index');
let passport = require('passport');
let passport_lib = require('./libs/passport');
let session = require('express-session');
let cors = require('cors');

app.set('view engine', 'ejs');
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true,
                                limit: '10mb',
                                parameterLimit: 1000000}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, 'public'),{maxAge: 60000}));
app.use(session({ secret: 'Walk_tall_my_friends', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(passport.initialize());

app.use('/', index);

app.listen(3000, function () {
  console.log('App is running on port 3000!');
});