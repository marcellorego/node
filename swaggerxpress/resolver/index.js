var _resolveRefs = require('json-refs').resolveRefs;
var _YAML = require('yaml-js');
var _fs = require('fs');

var resolveRefs = function(apiPath, options) {

    var _content = _fs.readFileSync(apiPath).toString();
    var _root = _YAML.load(_content);
    var _options = options || {
        filter        : ['relative', 'remote'],
        loaderOptions : {
            processContent : function (res, callback) {
                var loaded = _YAML.load(res.text);
                callback(null, loaded);
            }
        }
    };
    
    return _resolveRefs(_root, _options);
};

module.exports.resolveRefs = resolveRefs;