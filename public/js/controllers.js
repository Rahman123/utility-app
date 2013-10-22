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

        //checks for a given
        $scope.isActiveTab   = function(tabNameURL){
            return tabNameURL === $location.$$path;
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
                }, 
                function(err) {
                    $scope.errMsg = err;
                }
            );
        }
    }
);
