'use strict'

var HttpStatus = require('http-status-codes');
var debug = require('debug')('resultHandler');

var ValidationErrors = {
  REQUIRED: 'required',
  NOTVALID: 'notvalid'
};

module.exports = {
    copyBodyData: copyBodyData,
    handleOne: handleOne,
    handleMany: handleMany,
    handleError: handleError,
    handleEntityNotFound: handleEntityNotFound
}

function copyBodyData(body, model, copyFunctions) {
    for (var prop in body) {
        if (body[prop] !== undefined && model.hasOwnProperty(prop)) {
            if (copyFunctions && copyFunctions.hasOwnProperty(prop)) {
                var fn = copyFunctions[prop];
                model[prop] = fn(body[prop]);
            } else {
                model[prop] = body[prop];    
            }
        }
    }
}

function handleOne(res, error, result, statusCode) {
  if (error) {
    return handleError(res, error);
  }

  var statusCode = statusCode || 200;    

  if (!result) {
    statusCode = HttpStatus.NOT_FOUND;
    return res.
      status(statusCode).
      json({ code: HttpStatus.NOT_FOUND, error: 'Not found' });
  }

  res.status(statusCode).json(result);
  
  /*if (next) {
      next();
  }*/
}

function handleMany(res, error, result, statusCode) {
  if (error) {
    return handleError(res, error);
  }

  var statusCode = statusCode || 200;  

  res.status(statusCode).json(result);
  
  /*if (next) {
      next();
  }*/
}

function handleError(res, error) {
    
    var result = {
        code : HttpStatus.INTERNAL_SERVER_ERROR,
        message : 'Undefined error message'
    };
    
    if (error) {
        debug(error.message);
        result.code = error.code || result.code;
        result.message = error.message || result.message;
    }

    /*if (error.name == 'ValidationError') {
        
        /*var errorMessage = '';
        // go through all the errors...
        for (var errName in error.errors) {
            switch(error.errors[errName].kind) {
                case ValidationErrors.REQUIRED:
                    errorMessage = 'Field is required';
                break;
          case ValidationErrors.NOTVALID:
            errorMessage = 'Field is not valid';
            break;
        }
      }*/
        /*result.message = error.message;
    } else if (error.message) {
        result.message = error.message;
    } else {
        result.message = error.toString();
    }*/
    
    return res.
      status(HttpStatus.INTERNAL_SERVER_ERROR).
      json(result);
}

function handleEntityNotFound(result, statusCode) {
    
    return new Promise(function (resolve, reject) {
        if (!result || result.length == 0) {
            return reject({
                code : HttpStatus.NOT_FOUND,
                message: "NOT_FOUND"
            });
        }
        
        var resolved = result;
        if (statusCode) {
            resolved = function() {
                return [result, statusCode];
            };
        }
        
        resolve(resolved);
    });
}