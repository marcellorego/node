'use strict';

var path = require("path");

var getModels = function getModels(dbType) {
    dbType = dbType || "mongodb";
    var modelDef = "./" + dbType + "/index";
    var requiredModels = require(modelDef);
    return requiredModels;
}

module.exports = {
    get : getModels
};