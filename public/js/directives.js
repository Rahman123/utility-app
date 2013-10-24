//https://github.com/88media/JsonTreeDirective

//Press enter on textarea
angmodule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


//http://stackoverflow.com/questions/10418644/creating-an-iframe-with-given-html-dynamically
angmodule.directive('ngIframe', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        ngModel: '='
      },
      link: function(scope, element, attrs, tabsCtrl) {
      	scope.$watch('ngModel', function(newVal, oldVal) {
      		console.log(newVal+' vs '+oldVal);
	        updateIFrame(newVal);
	      });

      	function updateIFrame(html){
	        var iframe = $('<iframe width="100%" height="100%"/>');
			iframe[0].src = 'data:text/html;charset=utf-8,' + encodeURI(html);
			element.html('<div/>');
			element.append(iframe);
		}

      }
    };
  });