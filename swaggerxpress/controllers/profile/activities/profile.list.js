'use strict'

// Change to inject the service
var profileService = global.rootRequire('services/profile/profile.service');
var handler = global.rootRequire('helpers/resultHandler');

module.exports = function list (dto) {
    console.log("profile.list");
    
    var limit = dto.limit;
    
    return profileService.list(limit);
            /*.then(function(result) {
                return handler.handleEntityNotFound(result, 200);
            });*/
}