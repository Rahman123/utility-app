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