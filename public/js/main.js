var app = angular.module('main', ['ui.router','ipCookie'])
var server = "http://localhost:3000";
app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('test', {
      url: "/test",
      templateUrl: "./templates/test.html",
      controller: 'cookie'
    })
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
app.controller('cookie', ['$scope', 'ipCookie', function($scope, ipCookie) {
  // your code here
  ipCookie("testCookie", "data", { expires: 15 });
  console.log(ipCookie("testCookie"));
  //ipCookie.remove(key);
}]);
app.controller('Register',function($scope,$http){
	$scope.register = function(name,email,password){
		$http.post(server+"/api/member/register/"+name+"/"+email+"/"+password)
		.then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		    console.log(response)
		}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log(response)
		});
	}
	$scope.back = function(){
		window.history.back();
	}
});
app.controller('Index',function($scope,$http) {

	// $scope.init = function(){
	//     $scope.greeting = 'Welcome!';
	//     $scope.userinfo = false;
	//     $scope.session = false;
	//     $scope.cookies = false;
	//     $scope.loading = false;
	//     // setInterval(function(){
	//     // 	$scope.load()
	//     // }, 5000);
	//     //$scope.load();
	// }
	// $scope.load = function(){
	// 	$scope.loading = true;
	// 	if($scope.userinfo == false)
	// 	    {
	// 	    	$http.get("/function/check_login_session.php")
	// 	    	.success(function(data){
	// 	    		if($scope.cookies == false)
	// 	    		{
	// 	    			if(!data)
	// 	    				$scope.userinfo = false;
	// 		    		else
	// 		    		{
	// 		    			$scope.userinfo = true;
	// 		    			$scope.session = true;
	// 		    			$scope.name = data[0].name;
	// 		    			$scope.avatar = data[0].avatar;
	// 		    			$scope.backend = data[0].permission;
	// 		    		}
	// 	    		}
		    		
	// 	    	})
	// 	    	$http.get("/function/check_login_cookie.php")
	// 	    	.success(function(data){
	// 	    		if($scope.session == false)
	// 	    		{
	// 	    			if(!data)
	// 	    				$scope.userinfo = false;
	// 		    		else 
	// 		    		{
	// 		    			$scope.userinfo = true;
	// 		    			$scope.name = data[0].name;
	// 		    			$scope.avatar = data[0].avatar;
	// 		    			$scope.backend = data[0].permission;
	// 		    		}
	// 		    	}
		    		
	// 	    	})
	// 	    }
	// }
 //    $scope.login = function(email,password){
	// if (email == "" || email == null)
 //    	$scope.message = "please input email"
 //    else if (password == "" || password == null)
 //        $scope.message = "please input password"
 //    else{
	//     	if($scope.remember == true)
	// 	    {
	// 	    	var request = $http({
	// 	        method: "post",
	// 	        url: "/function/login_cookie.php",
	// 			data: {
	// 				email: email,
	// 				password: password
	// 			},
	// 			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	// 			});
	// 	        request.success(function (data) {
	// 				$scope.message = data
	// 				$scope.email = "";
	// 				$scope.password = "";
	// 				if(data != "email or password incorrect")
	// 				{
	// 					$scope.name = data[0].name;
	// 					$scope.avatar = data[0].avatar;
	// 					$scope.userinfo = true;
	// 					$scope.backend = data[0].permission;
	// 				}
	// 	        });
	// 	    }
	// 	    else
	// 	    {
	// 	    	var request = $http({
	// 	        method: "post",
	// 	        url: "/function/login_session.php",
	// 			data: {
	// 				email: email,
	// 				password: password
	// 			},
	// 			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	// 			});
	// 	        request.success(function (data) {
	// 				$scope.message = data
	// 				$scope.email = "";
	// 				$scope.password = "";
	// 				if(data != "email or password incorrect")
	// 				{
	// 					$scope.name = data[0].name;
	// 					$scope.avatar = data[0].avatar;
	// 					$scope.userinfo = true;
	// 					$scope.backend = data[0].permission;
	// 				}
	// 	        });
	// 	    }
	//     }
	// }
	// $scope.logout = function(){
	// 	$http.get("/function/logout.php")
	// 	.success(function(data){
	// 		$scope.userinfo = false;
	// 		$scope.message = "";
	// 		$scope.email = "";
	// 		$scope.password = "";
	// 		$scope.name = "";
	// 		$scope.avatar = "";
	// 		$scope.backend ="";
	// 	})
	// }
});