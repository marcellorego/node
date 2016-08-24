'use strict';

module.exports = {
    get : function get (req, res, next) {
        console.log('get');
        res.
            status(200).
            json(['133', '46']);
    },
    list: function list (req, res, next) {
        console.log(req.swagger.operationId);
        res.
            status(200).
            json(['133', '46']);
    }
};


/*module.exports = {
    get: //[
        function m1(req, res, next) {
            console.log('GET');
            next();
        }//,
        //function m2(req, res, next) { 
        //    res.
        //        status(200).
        //        json(['133', '46']); 
        //    next();
        //}
    //]
}*/