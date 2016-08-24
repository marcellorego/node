'use strict'

var Pipeline = global.rootRequire('pipeline/pipeline');
var MyListener = require('./myListener');

// Change to inject the service
var DatabaseService = global.rootRequire('services/database/database.service');

var DatabaseFindDatabaseById = function DatabaseFindDatabaseById(params) {
    
    var result = DatabaseService.findDatabaseById(params.id.value);
    return result;
    
    /*res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result, null, 2));
    res.end();*/
}

module.exports = function execute (req, res, next) {

    var p = new Pipeline(req, res)
        .addOperation(DatabaseFindDatabaseById)
        .addListener(new MyListener())
        .addListener(new MyListener());
        
    p.execute();
}

/*
const util = require('util');
const EventEmitter = require('events');

function MyStream() {
    EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);
*/
