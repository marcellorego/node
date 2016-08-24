'use strict';

var _ = require('lodash');
var handler = global.rootRequire('helpers/resultHandler');
var PipelineListener = global.rootRequire('pipeline/pipelineListener');

var Pipeline = function Pipeline(req, res) {
    
    this.operation = undefined;
    this.listeners = [];
    
    this.req = req;
    this.res = res;
    
    return this;
}

Pipeline.prototype = {
    
    addListener: function (listener) {
        
        if (_.isUndefined(listener)) {
            throw new Error('Listener not defined');
        }
        
        if (!(listener instanceof PipelineListener)) {
            throw new Error('Listener should inherit from PipelineListener.prototype');
        }
        
        this.listeners.push(listener);
        
        return this;
    },
    
    addOperation: function (operation) {
        
        if (_.isUndefined(operation) || !_.isFunction(operation)) {
            throw new Error('Operation method must be defined');
        }
        
        this.operation = operation;
        
        return this;
    },
    
    execute: function () {
        
        var result,
            error,
            self = this,
            params = self.req.swagger.params;
        
        try {
            
            if (_.isUndefined(self.operation) || !_.isFunction(self.operation)) {
                throw new Error('Operation must be a defined function');
            }
            
            _.each(self.listeners, function(listener) {
                listener.before(self.req, self.res);
            });
        
            result = self.operation(params);
            
            _.each(self.listeners, function(listener) {
                listener.after(self.req, self.res);
            });
            
        } catch (e) {
            error = e;
        }
        
        if (!_.isArray(result)) {
            handler.handleOne(self.res, error, result);
        } else {
            handler.handleMany(self.res, error, result);
        }
    }
}

module.exports = Pipeline;

/*var Promise = require('bluebird');

module.exports = function(){
	return new Promise(function(resolve, reject) {
		tradiationCallbackBasedThing(function(error, data){
			if (err) {
				reject(err);
			} else {
				resolve(data)
			}
		});
	});
}*/

