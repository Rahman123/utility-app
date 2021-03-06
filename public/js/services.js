'use strict';

var HOST = 'http://localhost:5000/'

angmodule.factory('AppUtils', ['$http', function ($http) {
	return {
		/* app constants */
		Const : {
			Events:{
				//informs about a change in location
				LOCATION_CHANGE : '__LOCATION_CHANGE_EVENT_',
			},

			//list of headers (requestCall type head)
			HEADERS_KEYS : ["Accept","Accept-Charset","Accept-Encoding","Accept-Language","Accept-Datetime","Authorization",
						"Cache-Control","Connection","Cookie","Content-Length","Content-MD5","Content-Type","Date","Expect","From",
						"If-Match","If-Modified-Since","If-None-Match","If-Range","If-Unmodified-Since","Max-Forwards",
						"Origin","Pragma","Proxy-Authorization","Range","Referer[sic]","TE","Upgrade","User-Agent","Via",
						"Warning","Host","X-Requested-With","DNT","X-Forwarded-For","X-Forwarded-Proto","Front-End-Https",
						"X-ATT-DeviceId","X-Wap-Profile","Proxy-Connection"],
			//json url that shows the possibile structure of a schema
			SCHEMA_EXAMPLE_URL : "/public/json/schema.json",
			//list of schema examples
			SCHEMA_EXAMPLES_LIST :[
				{
					name : "Users list",
					url : "/public/json/schema_1.json"
				},
				{
					name : "Random numbers",
					url : "/public/json/schema_2.json"
				},
				{
					name : "Complex structure",
					url : "/public/json/schema_3.json"
				},
				{
					name : "Array of names",
					url : "/public/json/schema_4.json"
				}
			],
		},

		/* fetch a content */
		fetchContent : function(url, callbackSuccess, callbackError){
			url = url || null;
			$http.get(url)
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
				})
			.error(function(data, status, headers, config) {
				callbackError(data);
			});
		},

		/* copy to clipboard*/
		copyToClipboard : function(value)
		{
			var txtInput = $('#holdText').val(value);
			var copied = txtInput[0].createTextRange();  
			copied.execCommand("RemoveFormat");  
			copied.execCommand("Copy");  
		}
	};
}]);

angmodule.factory('APIProxy', ['$http', function ($http) {
	return {
		/* app constants */
		base64Encode : function(data, callbackSuccess, callbackError){
			data = data || null;
			$http.post('/api/base64/encode',{data: data})
			  .success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(data, status, headers, config) {
			  	callbackError(data);
			  });
		},
		base64Decode : function(data, callbackSuccess, callbackError){
			data = data || null;
			$http.post('/api/base64/decode',{data: data})
			  .success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(data, status, headers, config) {
			  	callbackError(data);
			  });
		},

		requestCall : function(url,method, headers, body, callbackSuccess, callbackError){

			var config = {
				url : url || null,
				method : method || null,
				headers : headers || [],
				body : body || null,
			}
			console.log(config);
			$http.post('/api/request/call',config)
			.success(function(data, status, headers, config) {
			  	if(status !== 200){
			  		callbackError(data);
			  	}
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		saveRequest : function(url,method, headers, body, callbackSuccess, callbackError){

			var config = {
				url : url || null,
				method : method || null,
				headers : headers || [],
				body : body || null,
			}

			$http.post('/api/request/save',config)
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		removeRequest : function(id, callbackSuccess, callbackError){
			id = id || id;
			$http.delete('/api/request/'+id)
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		

		getStoredRequests : function(callbackSuccess, callbackError){
			$http.get('/api/request/sessionList')
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		resetSessionRequests : function(callbackSuccess, callbackError){
			$http.get('/api/request/resetSessionList')
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		produceRandomJson : function(schema, schemaURL, schemaId, callbackSuccess, callbackError){
			var url = '/api/randomJson';
			schema = schema || null;
			schemaURL = schemaURL || null;
			schemaId = schemaId || null;
			if(schemaURL){
				url +='?schemaURL='+encodeURIComponent(schemaURL);
			}
			else if(schemaId){
				url+='/'+schemaId;
			}
			$http.post(url, {schema : schema})
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		/* gets a request bin given its id */
		getRequestBin : function(id,callbackSuccess, callbackError){
			id = id || '';
			$http.get('/api/requestBin/get/'+id)
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},
		/* creates a new request bin */
		createRequestBin : function(callbackSuccess, callbackError){
			$http.post('/api/requestBin/create')
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		/* gets all the bins created in the current session */
		getSessionRequestBins : function(callbackSuccess, callbackError){
			$http.get('/api/requestBin/getSession')
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

	};
}]);

angmodule.factory('SFProxy', ['$http', function ($http) {
	return {
		/* gets the SF canvas details (if any) */
		getSFCanvasDetails : function(callbackSuccess, callbackError){
			$http.get('/api/sf/canvas/details')
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},
		/* describe global */
		describeGlobal : function(callbackSuccess, callbackError){
			$http.get('/api/sf/describeGlobal')
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},

		/* compare 2 SObjects */
		compareSObjectsMetadata : function(source, destination, callbackSuccess, callbackError){
			source = source || null;
			destination = destination || null;
			$http.post('/api/sf/compareSObjectsMetadata',{source: source, destination: destination})
			.success(function(data, status, headers, config) {
			  	if(status !== 200) callbackError(data);
				else callbackSuccess(data);
			  })
			  .error(function(err) {
			  	callbackError(err);
			  });
		},
	}
}]);
