'use strict';

var debug = require('debug')('activity');
var _ = require('lodash');
var HttpStatus = require('http-status-codes');
var handler = global.rootRequire('helpers/resultHandler');
var ActivityListener = global.rootRequire('activity/activityListener');
var Promise = global.Promise;

var Activity = function Activity(name, operation, listeners, nextActivity) {
    
    if (_.isUndefined(name) || name == "") {
        throw new Error('A unique name must be defined');
    }
    
    if (_.isUndefined(operation) || !_.isFunction(operation)) {
        throw new Error('Operation must be a defined function');
    }
    
    var self = this;
    this.name = name;
    this.operation = operation;
    this.listeners = listeners || [];
    this.nextActivity = nextActivity;

    return function(req, res, next) {

        var promise,
            error,
            data = {};
        
        _.forEach(req.swagger.params, function(param, key) {
            debug(key + '=' + param.value);
            data[key] = param.value;
        });
        
        try {

            promise = self.execute(data)
                .then(function (results) {
                    self.donePromise(req, res, next, results);
                })
                .catch(function(error){
                    self.catchError(res, error);
                });
            
            return promise;
            
        } catch (e) {
            error = e;
            debug('error:', error);
            self.handleError(res, error);
        }
    }
};

Activity.prototype.donePromise = function donePromise(req, res, next, results) {
    var self = this,
        data,
        params = [res];
    
    if (_.isFunction(results)) {
        data = results.call();
        params = params.concat(data);
    } else {
        data = results;
        params.push(data);
    }
    
    if (self.nextActivity) {
        req.swagger.params[self.name] = {
            value : data
        };
        return self.nextActivity(req, res, next);
    } else {
        self.sendResponse.apply(self, params);
    }
}

Activity.prototype.sendResponse = function sendResponse(res, data, statusCode) {
    if (!_.isArray(data)) {
        handler.handleOne(res, null, data, statusCode);
    } else {
        handler.handleMany(res, null, data, statusCode);
    }
};

Activity.prototype.catchError = function catchError(res, error) {
    handler.handleError(res, error);
};

Activity.prototype.executePromise = function executePromise(fnc, data) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var result = fnc(data);
        if (!result) return reject({
            code:HttpStatus.INTERNAL_SERVER_ERROR,
            message: "undefined or null result in ".concat(self.name).concat(" activity executing ").concat(fnc.name || 'anonymous').concat(' operation.')
        });
        resolve(result);
    });
};

Activity.prototype.execute = function execute (data) {
    
    var self = this,
        before = [], 
        after = [],
        allPromises = [],
        result;
    
    _.each(self.listeners, function(listener) {
        if (!_.isUndefined(listener) && (listener instanceof ActivityListener)) {
            before.push(listener.before);
            after.push(listener.after);
        }
    });
    
    allPromises = allPromises.concat(before);
    allPromises.push(self.operation);
    allPromises = allPromises.concat(after);
    
    result = self.nextPromise(allPromises, data, 0);
    
    return result;
};

Activity.prototype.nextPromise = function nextPromise (allPromises, data, index) {
    var self = this,
        fnc,
        result;

    fnc = allPromises[index];
    index++;
    result = self.executePromise(fnc, data)
        .then(function(result) {
            if (index < allPromises.length) {
                return self.nextPromise(allPromises, result, index);
            } else {
                return result;
            }
        }, function (err) {
            throw err;
        });

    return result;
};

module.exports = Activity;