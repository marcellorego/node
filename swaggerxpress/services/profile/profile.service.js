'use strict';

var wagner = require('wagner-core');

/**
  * parameters expected in the args:
  * limit (Integer)
**/
module.exports.list = function list(limit) {
    
    var ProfileModel = wagner.get('ProfileModel');
    
    var promisse = 
        ProfileModel
        .find({})
        .sort({'name': 1});

    if (limit && limit > 0) {
        promisse.limit(limit);
    }
        
    promisse.exec();
        
    return promisse;
};

module.exports.findByCode = function findByCode(codes) {
    
    var ProfileModel = wagner.get('ProfileModel');
    
    var promisse = 
        ProfileModel
        .find({ "code": { "$in" : codes} });
        
    promisse.exec();
        
    return promisse;
}