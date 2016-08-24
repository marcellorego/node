'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var definition = {
    _id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['A','C']
    },
    description: {
        type: String,
        required: false
    }
};

var schemaName = 'Profile';
var collectionName = 'profiles';
var schema = new Schema(definition, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true 
    }
});

/*schema.virtual('code')
.get(function() {
    return this._id;
}).set(function(value) {
    this._id = value;
});*/

/*schema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret._id;
        return ret;
    }
});*/

var toJSON = {
    transform: function(doc, ret, options) {
        var retJson = {
            code: ret._id,
            name: ret.name,
            description: ret.description,
            type: ret.type
        };
        return retJson;
    }
};

var toObject = {
    transform: function(doc, ret) {
        return ret;
    }
};

schema
.set('toJSON', toJSON)
.set('toObject', toObject);

module.exports.schemaName = schemaName;
module.exports.collectionName = collectionName;
module.exports.definition = definition;
module.exports.schema = schema;
module.exports.model = mongoose.model(schemaName, schema, collectionName);