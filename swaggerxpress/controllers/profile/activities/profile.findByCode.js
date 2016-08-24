'use strict'

// Change to inject the service
var profileService = global.rootRequire('services/profile/profile.service');

module.exports = function findByCode (dto) {
    console.log("profile.findByCode");
    
    var codes = dto.codes || [];
    
    return profileService.findByCode(codes);
}