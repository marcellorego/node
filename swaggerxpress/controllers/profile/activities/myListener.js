'use strict'

var ActivityListener = global.rootRequire('activity/activityListener')
    ,inherits = require('util').inherits,
    handler = global.rootRequire('helpers/resultHandler')
    ;

var MyListener = function MyListener(name) {
    ActivityListener.call(this);
}

inherits(MyListener, ActivityListener);

MyListener.prototype.before = function before(dto) {
    console.log("MyListener1 before");
    return dto;
}

MyListener.prototype.after = function after(dto) {
    console.log("MyListener1 after");
    
    //return handler.handleEntityNotFound(dto, 200);
    
    return dto;
}

module.exports = MyListener;