var mongoose = require('mongoose');
var C = require('./config.js');

mongoose.connect(C.DB.url);
exports.mongoose = mongoose;

var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
	  console.log('Mongoose connected!');
	});

/* Single request inside a given bin */
var requestBinSingleRequestSchema = mongoose.Schema({
    	headers : {},
    	body : String,
    	method : String,
    	host : String,
        query : {},
    	created: { type: Date, default: Date.now }
	},
	{ collection : 'RequestBinSingleRequest' });
exports.RequestBin = mongoose.model('RequestBinSingleRequest', requestBinSingleRequestSchema);

/* Collections of bins */
var requestBinSchema = mongoose.Schema({
    	id : String,
    	user : String,
    	requests : [requestBinSingleRequestSchema],
    	created: { type: Date, default: Date.now }
	},
	{ collection : 'RequestBin' });
exports.RequestBin = mongoose.model('RequestBin', requestBinSchema);