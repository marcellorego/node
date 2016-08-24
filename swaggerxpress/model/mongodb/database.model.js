'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	parent: { 
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Apimeta'
    },
	name: { 
        type: String,
        required: true
    },
	extend: { 
        type: [String],
        required: false
    },
    properties : [{ 
        type: Schema.Types.ObjectId,
        ref: 'Property'
    }]
};

var objectSchema = new Schema(fields);

module.exports = mongoose.model('Object', objectSchema);
