'use strict'

var fs = require('fs'),
    path = require('path');

function getChildrenDirs(srcpath) {
    var files = fs.readdirSync(srcpath);
    var result = files.map(function (file) {
        var name = path.join(srcpath, file);
        return name;
    }).filter(function (file) {
        var isDirectory = fs.statSync(file).isDirectory(); 
        return isDirectory;
    });  
    return [srcpath].concat(result);
}

module.exports = {
      getChildrenDirs : getChildrenDirs  
};