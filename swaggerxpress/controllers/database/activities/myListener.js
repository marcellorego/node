'use strict'

var Listener = global.rootRequire('pipeline/pipelineListener');

var MyListener = function MyListener() {
    
}

MyListener.prototype = Listener.prototype;

MyListener.prototype.before = function before(dto) {
    console.log("MyListener before");
    return dto;
}

module.exports = MyListener;