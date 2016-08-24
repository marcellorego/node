'use strict';

var Activity = global.rootRequire('activity/activity.js');
var MyListener = require('./activities/myListener');
//var Listener = global.rootRequire('activity/activityListener');

var list = new Activity("list", require("./activities/profile.list"), [
    new MyListener()
]);

var findByCode = new Activity("findByCode", require("./activities/profile.findByCode"));

module.exports = {
    list : list,
    findByCode : findByCode
}