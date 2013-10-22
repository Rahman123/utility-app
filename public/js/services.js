'use strict';

angmodule.factory('AppUtils', ['$http', function ($http) {
	return {
		/* app constants */
		Const : {
			Events:{
				//informs about a change in location
				LOCATION_CHANGE : '__LOCATION_CHANGE_EVENT_',
			},
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
		}

		
	};
}]);
