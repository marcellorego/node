'use strict'

var DatabaseService = global.rootRequire('services/database/database.service');

module.exports = function execute(req, res, next) {
    
    var result = DatabaseService.findAllSchemas(req.swagger.params.limit.value);
    
    if (result)
        res.status(200).json(result);
    else
        res.status(404).send();

    //res.setHeader('Content-Type', 'application/json');
        //res.end(JSON.stringify(result, null, 2));
};