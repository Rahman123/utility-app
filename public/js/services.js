'use strict';

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
						"X-ATT-DeviceId","X-Wap-Profile","Proxy-Connection"]
		},


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

			$http.post('/api/request/call',config)
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

		produceRandomJson : function(schema, callbackSuccess, callbackError){
			$http.post('/api/randomJson', schema)
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
