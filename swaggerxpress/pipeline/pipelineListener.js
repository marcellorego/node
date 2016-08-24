'use strict';

var PipelineListener = function PipelineListener() {
    return this;
}

PipelineListener.prototype.before = function before(req, res, next) {
    console.log("PipelineListener before");
}

PipelineListener.prototype.after = function after(req, res, next) {
    console.log("PipelineListener after");
}

module.exports = PipelineListener;