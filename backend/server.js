// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path     = require('path');
var app      = express();
var port     = 80;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var readDirFiles = require('read-dir-files');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var multer       = require('multer');
var flash        = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database mongodb://localhost/myDB

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(flash());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
// Frontend routes
app.use('/', express.static(path.join(__dirname, '../frontend')));

// Admin routes
app.use('/admin', require('./app/adminRoutes.js')(app, passport));

// API routes
app.use('/api', require('./app/apiRoutes.js'));

app.use('/archive', express.static(path.join(__dirname, '/app/archive')));

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
