'use strict'

global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
}

// call the packages we need
var express    = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieSession = require('cookie-session'),
    favicon = require('serve-favicon'),

    path = require("path"),
    _ = require('lodash'),
    wagner = require('wagner-core'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    errorhandler = require('errorhandler')
    ;

var env = process.env.NODE_ENV || 'development';  // set our env
var port = process.env.PORT || 8080;   // set our port

//Load package.json
var packageJson = require(path.join(__dirname, '/package.json'));

//var MemoryStore = express.session.MemoryStore;
var app = express(); // define our app using express
//var sessionStore = new MemoryStore({ reapInterval: 60000 * 10 });

// Properties for the application
app.locals.database = packageJson.database;
app.locals.version = packageJson.version;
app.locals.title = packageJson.title;

/*app.locals.viewsFolder = packageJson.config.viewsFolder;
app.locals.viewsEngine = packageJson.config.viewsEngine;
app.locals.publicFolder = packageJson.config.publicFolder;
app.locals.contextRoot = packageJson.config.contextRoot;*/

app.locals.config = packageJson.config;
app.locals.database = packageJson.database;

// =============================================================================
// view engine setup
// =============================================================================
app.set('views', path.join(__dirname, app.locals.config.viewsFolder));
app.set('view engine', app.locals.config.viewsEngine);
/*app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');*/


// =============================================================================
// UNCOMMENT AFTER PLACING YOUR FAVICON IN /PUBLIC
// =============================================================================
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// =============================================================================
// HTTP PARSERS
// =============================================================================
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// =============================================================================
// CORS SUPPORT
// =============================================================================
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// =============================================================================
// LESS MIDDLEWARE
// =============================================================================
app.use(require('less-middleware')(path.join(__dirname, app.locals.config.publicFolder)));


// =============================================================================
// STATIC PUBLIC FOLDER
// =============================================================================
app.use(express.static(path.join(__dirname, app.locals.config.publicFolder)));


// =============================================================================
// ERROR HANDLERS
// =============================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}*/

// production error handler
// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});*/

// =============================================================================
// ERROR DUMP
// =============================================================================
if ('development' == env) {
    app.use(logger('dev'));
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('view options', {
        pretty: true
    });
}

if ('test' == env) {
    app.use(logger('test'));
    app.set('view options', {
        pretty: true
    });
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
}

if ('production' == env) {
    app.use(logger());
    app.use(errorhandler({
        dumpExceptions: false,
        showStack: false
    }));
}

// =============================================================================
// READ API SWAGGER
// =============================================================================


// =============================================================================
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();  // get an instance of the express Router

// =============================================================================
// REGISTER OUR CONTEXT
// all of our routes will be prefixed with this context
// =============================================================================
app.use(app.locals.config.contextRoot, router);

// =============================================================================
// CONNECT TO THE DATABASE
// =============================================================================
//var connectDB = require('./db/index');
//var db = connectDB(app.locals.database, onDatabaseOpened, onDatabaseError);

onDatabaseOpened();

// =============================================================================
// START THE SERVER
// =============================================================================
function onDatabaseOpened() {

    // load models
    // load controllers
    // load services


    app.listen(port, function () {
        console.log('Express server listening on port %d in %s mode', port, env);
    });
};

function onDatabaseError() {
    console.error.bind(console, 'connection error:')
};

module.exports = app;
