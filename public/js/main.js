var app = angular.module('main', ['ui.router','ipCookie'])
var server = "http://localhost:3000";
app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  	$stateProvider
    .state('entersite', {
      url: "/entersite",
      templateUrl: "./templates/entersite.html"
    })
  	$stateProvider
    .state('/', {
      url: "/",
      templateUrl: "./templates/portal.html",
      controller: 'Index'
    })
	$stateProvider
    .state('register', {
      url: "/register",
      templateUrl: "./templates/register.html",
      controller: 'Register'
    })
   	$stateProvider
    .state('backend', {
      url: "/backend",
      templateUrl: "./backend/index.html",
      controller: 'Index'
    })
  
});
app.controller('Register', ['$scope', '$http' , '$state' ,'ipCookie', function($scope, $http, $state, ipCookie) {

	$scope.checkOppainame = function(name){
		$http.get(server+"/api/users/"+name)
		.success(function(data){
			if(name==undefined)
				$scope.Pass = 'default';
			else if (data == "" || data == null)
				$scope.Pass = true;
			else if (data != "" || data != null)
				$scope.Pass = false;
		});
	};
	$scope.register = function(name,email,password){
		var hashPassword = calcSHA1(password);
		var data = {};
		if (email == "" || email == null)
	    	$scope.message = "please input email";
	    else if (password == "" || password == null)
	        $scope.message = "please input password";
	    else if (name == "" || name == null)
	    	$scope.message = "please input oppai name";
	    else{
			$http.post(server+"/api/member/register/"+name+"/"+email+"/"+hashPassword)
			.then(function successCallback(response) {
				data = response.data;
			}, function errorCallback(response) {
			
			});
			$scope.message = "Register successful please wait redirect. . .";
			setTimeout(function () {
	          	$scope.$apply(function () {
					ipCookie("cookieLogin", calcSHA1(data), { expires: 15 });
					//ipCookie.remove(key);
	              	$state.go("/");
	          	});
	      	}, 3000);
		}
	}

	$scope.back = function(){
		window.history.back();
	}
}]);
app.controller('Index',function($scope,$http) {
	$scope.init = function(){
	    $scope.greeting = 'Welcome!';
	}
	$scope.load = function(){
		
	}
    $scope.login = function(email,password){
    	var hashPassword = calcSHA1(password);
		if (email == "" || email == null)
	    	$scope.message = "please input email"
	    else if (password == "" || password == null)
	        $scope.message = "please input password"
	    else{
		    	
		}
	}
	$scope.logout = function(){
		
	}
});