'use strict';

var ActivityListener = function ActivityListener(name) {
    //return this;
}

ActivityListener.prototype.before = function before(dto) {
    console.log("ActivityListener before ");
    return dto;
}

ActivityListener.prototype.after = function after(dto) {
    console.log("ActivityListener after ");
    return dto;
}

module.exports = ActivityListener;