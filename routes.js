var request = require('request');
var MAX_SESSION_SIZE = 10;

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
									timestamp: Date.now()
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

exports.getSessionRequests = function(req,res){
	if(!req.session.requests)req.session.requests = [];
	res.send(req.session.requests);
}