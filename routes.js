var request = require('request');
var randomString = require('random-string');
var randomJson = require('./random-json');
var MAX_SESSION_SIZE = 10;

//Base64 decode a string
exports.base64Decode = function(req,res){
	var body = req.body;
	if(!req.body || !body || !body.data) {
		res.statusCode = 400;
		return res.send({error:'Nothing to decode'});
	}
	try {
		var decoded = new Buffer(body.data, 'base64').toString('utf8');
		return res.send({data: decoded});
	}
	catch(e) {
		res.statusCode = 400;
		return res.send({error:'Error decoding string: '+e});
	}
	
}

//Base64 encode a string
exports.base64Encode = function(req,res){
	var body = req.body;
	if(!req.body || !body|| !body.data) {
		res.statusCode = 400;
		return res.send({error:'Nothing to decode'});
	}
	try {
		var encoded = new Buffer(body.data).toString('base64');
		return res.send({data: encoded});
	}
	catch(e) {
		res.statusCode = 400;
		return res.send({error:'Error decoding string: '+e});
	}
	
}

//make an HTTP request
exports.requestCall = function(req,res){
	if(!req.body){
		res.statusCode = 400;
		return res.send('No body on request. Missing all parameters.');
	}
	var headers = {};
	if(req.body.headers) {
		for(v in req.body.headers)
		{
			var h = req.body.headers[v];
			if(!h) continue;
			headers[h.key] = h.value;
		}
	}
	
	var options = {
		method : req.body.method || null,
		uri : req.body.url || null,
		headers  : headers,
		body : req.body.body || null,  
	};
	
	request(options,function(error, response, body){

		if(!req.session.requests)req.session.requests = [];
		options.headers = req.body.headers;
		var requestSession = {request: options,
									timestamp: Date.now(),
									id : randomString({length: 20})
							};
		if(req.session.requests.length >= MAX_SESSION_SIZE){
			req.session.requests.unshift(requestSession);
			req.session.requests.pop();
		}
		else
			req.session.requests.push(requestSession);

		response = response || null;
		body = body || null;
		statusCode = (response)? response.statusCode : null;
		headers = (response)?response.headers : {};
		error = (error)?error.toString():null;
		try{
			body = JSON.parse(body);
		}catch(e){}
		res.send({error: error, 
					status : statusCode, 
					headers : headers , 
					body : body  || null,
				});
	});
};

//get all session stored http requests
exports.getSessionRequests = function(req,res){
	if(!req.session.requests)req.session.requests = [];
	res.send(req.session.requests);
}

//reset session for http requests stored
exports.resetSessionRequests = function(req,res){
	req.session.requests = [];
	res.send({});
}

//download a single http request from session 
exports.downloadRequest = function(req,res){
	if(!req.params || !req.params.id){
		res.statusCode = 400;
		return res.send({error: 'No request found.'});
	}
	if(!req.session || !req.session.requests) content = {error: 'No request found'};
	else{
		for(v in req.session.requests){
			if(req.session.requests[v].id === req.params.id){
				content = req.session.requests[v];
				break;
			}
		}
	}
	res.setHeader('content-type', 'application/json');
	res.setHeader( "Content-Disposition", "attachment; filename=\""+req.params.id+".json\"" );
	return res.end(JSON.stringify(content));
}

//download all http request sotred in session
exports.downloadAllRequests = function(req,res){
	if(!req.session || !req.session.requests) content = {error: 'No request found'};
	else content = req.session.requests;
	res.setHeader('content-type', 'application/json');
	res.setHeader( "Content-Disposition", "attachment; filename=\"requests.json\"" );
	return res.end(JSON.stringify(content));
}

//produces a random json (given a schema)
var MAX_SCHEMA_SIZE = 3000;
exports.produceRandomJSON = function(req,res){
	console.log(req.body);
	if(!req.body || (!req.body.schema && !req.params.schemaId && !req.query.schemaURL)){
		res.statusCode = 400;
		return res.send({code: '001', error: 'No schema body or schema id set'});
	}
	if(req.body && req.body.schema && JSON.stringify(req.body.schema).length > MAX_SCHEMA_SIZE){
		res.statusCode = 400;
		return res.send({code: '002', error: 'Schema too complicate. Max 3000 chars.'});
	}

	//get schema from request body
	var schema = req.body.schema;
	if(schema){
		var produced = randomJson({schema: schema});
		return res.send(produced);
	}

	//get stored schema
	var schemaId = req.params.schemaId;
	if(schemaId){
		return res.send({});
	}

	//get schema from URL
	var schemaURL = req.query.schemaURL;
	if(schemaURL){
		var options = {
			method : 'GET',
			uri : schemaURL || null,
		};
		
		request(options,function(error, response, body){
			if(error){
				res.statusCode = 400;
				return res.send({code: '003', error: 'Unexpected error: '+error});
			}
			if(response.statusCode !== 200){
				return res.send({code: '004', error: 'Server responded : '+response.statusCode+' - '+body});
			}
			
			if(body && body.length > MAX_SCHEMA_SIZE){
				res.statusCode = 400;
				return res.send({code: '002', error: 'Schema too complicate. Max 3000 chars.'});
			}

			try{
				body = JSON.parse(body);
			}catch(e){
				res.statusCode = 400;
				return res.send({code: '003', error: 'Unexpected error: '+e});
			}
			var produced = randomJson({schema: body});
			return res.send(produced);
		});
	}
}