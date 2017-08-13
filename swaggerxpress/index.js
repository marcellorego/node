'use strict';

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

var cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieSession = require('cookie-session'),
    favicon = require('serve-favicon');

var debug = require('debug')('mainApp');
var swaggerTools = require('swagger-tools');
var path = require("path");
var _ = require('lodash');
var fileUtils = require('./helpers/fileUtils');

var app = require('express')();

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

// Load configurations from outside
var isDevelopment = (process.env.NODE_ENV === 'development') ? true : false;
var serverPort = process.env.SERVERPORT || process.env.PORT;
var serverIP = process.env.SERVERIP || process.env.IP;
var dbServer = process.env.DBSERVER || process.env.IP;

console.log(serverIP);
// Controllers root folder
var controllers = process.env.CONTROLLERS || 'controllers';
var dbConfig = require('./configuration/index');
dbConfig.host = dbServer;

// swaggerRouter configuration
var options = {
  swaggerUi: '/swagger.json',
  controllers: fileUtils.getChildrenDirs(path.join(__dirname, controllers)),
  useStubs: isDevelopment// Conditionally turn on stubs (mock mode)
};

var apiDescriptor = path.join(__dirname, '/apiYaml/index.yaml');
var resolver = require('./resolver/index');
resolver
    .resolveRefs(apiDescriptor)
    .then(function(results) {
        results.resolved.host = serverIP;
        if (serverPort) {
            results.resolved.host += ':' + serverPort;
        }
        initializeDatabaseConn(results.resolved);
    }, function (err) {
        debug(err.stack);
        shuttDown(1);
    });

var initializeDatabaseConn = function(resolved) {
    
// =============================================================================
// CONNECT TO THE DATABASE
// =============================================================================
    var DBConnect = require('./db/index');
    var db = new DBConnect();
    var connection = db.connect(dbConfig,
        function() {
           onDatabaseOpened(resolved, connection);
        },
        function(error) {
            debug('connection error: ' + error.toString());
            shuttDown(1, connection);
        });
};

var initializeModels = function() {
    
    var wagner = require('wagner-core');
    
    var modelDef = require('./model/index');
    //Load the routes
    var models = modelDef.get(dbConfig.dbType);
    _.each(models, function(config, key) {
        wagner.factory(key, function() {
            return config.model;
        });
    });
    
    /*var models = require('./model/mongodb/index');
    _.each(models, function(config, key) {
        wagner.factory(key, function() {
            return config.model;
        });
    });*/
};

var initializeMiddleware = function(swaggerDoc) {

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        var swaggerMetadata = middleware.swaggerMetadata();
        var swaggerMetadataWrapper = function swaggerMetadataWrapper (req, res, next) {
            var result = swaggerMetadata(req, res, next);
            return result;
        }
        app.use(swaggerMetadataWrapper);
        
        // Provide the security handlers
        /*app.use(middleware.swaggerSecurity({
            oauth2: function (req, def, scopes, callback) {
            // Do real stuff here
            }
        }));*/
        
        // Validate Swagger requests
        var swaggerValidator = middleware.swaggerValidator({
            validateResponse: isDevelopment
        });
        app.use(swaggerValidator);

        // Route validated requests to appropriate controller
        var swaggerRouter = middleware.swaggerRouter(options);
        var swaggerRouterWrapper = function swaggerRouterWrapper(req, res, next) {
            var result = swaggerRouter(req, res, next);
            return result;
        }
        app.use(swaggerRouterWrapper);

        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());
    });
};

// =============================================================================
// DATABASE CONNECTED
// =============================================================================
function onDatabaseOpened(resolved, connection) {
    
    var sockets = [];
    /*var shutting_down = false;
    
    app.use("/shutdown", function(req, resp, next) {
        console.log('Request URL:', req.originalUrl);
        cleanup();
    });
    
    app.use(function (req, resp, next) {
        if(!shutting_down) {
            console.log('Request URL:', req.originalUrl);
            return next();
        }

        resp.setHeader('Connection', "close");
        resp.send(503, "Server is in the process of restarting");
        // Change the response to something your client is expecting:
        //   html, text, json, etc.
    });*/
    
    initializeMiddleware(resolved);
    initializeModels();

    // Start the server
    var server = app.listen(serverPort, function () {
        console.log('Server is listening on port %d (%s:%d)', serverPort, serverIP, serverPort);
        console.log('Swagger-ui is available on %s:%d/docs', serverIP, serverPort);
    }).on('close', function () {
        shuttDown(0, connection, sockets);
    }).on('connection', function(socket) {
        sockets.push(socket);
    });
    
    var cleanup = function cleanup () {
        //shutting_down = true;
        server.close(function () {
            console.log("Closing server...");
        });
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

};

var shuttDown = function(code, connection, sockets) {
    
    if (connection) {
        console.log("Closed out database connection.");
        connection.close();
    }

    // Add this part to manually destroy all the connections.
    if (sockets) {
        console.log("Closed out remaining connections.");
        sockets.forEach(function(socket) {
            socket.destroy();
        });
    }
    
    console.log('Shutting down server in 5 seconds ... code %s', code);
    setTimeout(function() {
        console.log("End");
        process.exit(code);
    }, 5000);
};