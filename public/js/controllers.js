var CONFIG = {
    NUMBER_OF_RECORDS : [10,25,50,100]
};

angmodule.controller("GlobalCtrl",
    function($scope, $http, $filter,$location,AppUtils){
    	console.log('GlobalCtrl');

        $scope.$on(AppUtils.Const.Events.LOCATION_CHANGE,function locationChanged(){
            console.log('Location changed (GlobalCtrl): '+$location.$$path);
        });
    }
);

angmodule.controller("MenuCtrl",
    function($scope, $http, $filter, $location, AppUtils){
        console.log('MenuCtrl');

        $scope.isActiveTab   = function(tabNameURL) {
            if(typeof tabNameURL === 'string') {
                return tabNameURL === $location.$$path;
            }
            else {
                for(v in tabNameURL) 
                    if(tabNameURL[v] === $location.$$path) 
                        return true;
            }
            return false;
        }

    }
);

angmodule.controller("HomeCtrl",
    function($scope, $http, $filter, $location, AppUtils){
    	console.log('HomeCtrl');
        $scope.$emit(AppUtils.Const.Events.LOCATION_CHANGE,{});
    }
);

angmodule.controller("AboutCtrl",
    function($scope, $http, $filter, $location, AppUtils){
        console.log('AboutCtrl');
        $scope.$emit(AppUtils.Const.Events.LOCATION_CHANGE,{});
    }
);

angmodule.controller("Base64Ctrl",
    function($scope, $http, $filter, $location, AppUtils, APIProxy){
        console.log('Base64Ctrl');
        $scope.errMsg = null;

        $scope.$emit(AppUtils.Const.Events.LOCATION_CHANGE,{});

        $scope.encode = function(){
            $scope.errMsg = null;

            APIProxy.base64Encode($scope.plain, 
                function(data) {
                    $scope.encoded = data.data;
                    $('#encodedTextarea').focus();
                }, 
                function(err) {
                    $scope.errMsg = err;
                }
            );
        }

        $scope.decode = function(){
            $scope.errMsg = null;

            APIProxy.base64Decode($scope.encoded, 
                function(data) {
                    $scope.plain = data.data;
                    $('#plainTextarea').focus();
                }, 
                function(err) {
                    $scope.errMsg = err;
                }
            );
        }
    }
);

angmodule.controller('UrlEncodeCtrl',
    function($scope, $http, $filter, $location, AppUtils, APIProxy){
        console.log('UrlEncodeCtrl');
        $scope.errMsg = null;
        $scope.$emit(AppUtils.Const.Events.LOCATION_CHANGE,{});

        $scope.encode = function(){
            $scope.errMsg = null;
            if(!$scope.plain){
                return $scope.errMsg = 'Invalid string.';
            }
            $scope.encoded = encodeURIComponent($scope.plain);
            $('#encodedTextarea').focus();
        }

        $scope.decode = function(){
            $scope.errMsg = null;
            if(!$scope.encoded){
                return $scope.errMsg = 'Invalid string.';
            }
            $scope.plain = decodeURIComponent($scope.encoded);
            $('#plainTextarea').focus();
        }
});

angmodule.controller('RequestCtrl',
    function($scope, $http, $filter, $location, AppUtils, APIProxy){
        console.log('RequestCtrl');
        $scope.errMsg = null;
        $scope.$emit(AppUtils.Const.Events.LOCATION_CHANGE,{});

        $scope.headersList = AppUtils.Const.HEADERS_KEYS;
        $scope.method = 'GET';
        $scope.headers = [];

        $scope.addHeader = function(){
            $scope.headers.push({key:"",value:""});
        }


        $scope.removeHeader = function(index){
            if((index!==0 && !index) || index < 0) return;
            if(!$scope.headers) return;
            if($scope.headers.length < index) return;
            $scope.headers.splice(index,1);
        }

        $scope.response = {}; 
        $scope.requestCall = function(){
            $scope.request = {}; 
            APIProxy.requestCall($scope.url, $scope.method, $scope.headers, $scope.body, 
                function(data){
                    $scope.response = data;
                    $scope.getStoredRequests();
                },
                function(err) {
                    $scope.response.error ='Unexpected error: '+err;
                });
        }

        $scope.sessionRequests = [];
        $scope.getStoredRequests = function(){
            APIProxy.getStoredRequests(function(data){
                console.log(data);
                $scope.sessionRequests = data;
            },
            function(err){
                $scope.sessionRequests = [];
            });
        }

        $scope.loadRequestFromSession = function(sessionRequest){
            $scope.url = sessionRequest.request.uri;
            $scope.body = sessionRequest.request.body;
            $scope.method = sessionRequest.request.method;
            $scope.headers = sessionRequest.request.headers || [];
        }

        $scope.resetSessionHistory = function(){
            APIProxy.resetSessionRequests(function(data){
                $scope.sessionRequests = [];
            },
            function(err){
                handleError(err);
            });
        }


        function init(){
            $scope.getStoredRequests();
        }   
        init();

});


angmodule.controller('RandomJSONCtrl',
    function($scope, $http, $filter, $location, AppUtils, APIProxy){
        $scope.errMsg = null;

        $scope.produceJSON = function(schemaURL, schemaId){
            $scope.errMsg = null;
            var schema = null;

            if(!schemaURL && !schemaId){
                try{
                    schema = JSON.parse($scope.schema);
                }catch(e){
                    $scope.errMsg = 'Invalid JSON: '+e;
                    return;
                }
            }

            APIProxy.produceRandomJson(schema, schemaURL, schemaId,
                function(json){
                    $scope.randomJson = json;
                },
                function(err){
                    $scope.errMsg = err;
                });
        }
});

function handleError(msg){
    alert(msg);
}