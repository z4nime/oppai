var app = angular.module('main', ['ui.router','ipCookie','ngCkeditor','imageupload'])
app.config(function($stateProvider, $urlRouterProvider){
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
      controller: 'Index as ctrl'
    })
  $stateProvider
    .state('register', {
      url: "/register",
      templateUrl: "./templates/register.html",
      controller: 'Register as ctrl'
    })
    $stateProvider
    .state('backend', {
      url: "/backend",
      templateUrl: "./backend/index.html",
      controller: 'Backend as ctrl'
    })
  
});
app.controller('Register', ['$scope', '$http' , '$state' ,'ipCookie', function($scope, $http, $state, ipCookie){
  var ctrl = this;
  ctrl.checkOppainame = function(oppai_name){
    if(oppai_name==undefined)
      $scope.namePass = 'default';
    else
    {
      $http.get("/api/users/"+oppai_name)
      .success(function(data){
        if(data!='')
          $scope.namePass = false;
        else
          $scope.namePass = true; 
      }); 
    }
    
  };
  ctrl.checkEmail = function(email){
    $http.get("/api/users/")
    .success(function(data){
      if(email==undefined)
        $scope.emailPass = 'default';
      else{
        if(data =='')
          $scope.emailPass = true;
        else
        {
          for(var i=0;i<data.length;i++)
          {
            if(email==data[i].email)
            {
              $scope.emailPass = false;
              break;
            }
            else
              $scope.emailPass = true;
          }
        }

      }
    });
  };
  ctrl.Register = function(data){
    var hashPassword = calcSHA1(data.password);
    data.password = hashPassword;
    $http.post("/api/users/register/",data)
    .then(function successCallback(response) {
      //console.log(response.data)
    }, function errorCallback(response) {
      
    });
    $scope.message = "Register successful please wait redirect. . .";
    setTimeout(function () {
          $scope.$apply(function () {
        ipCookie("cookieLogin", data, { expires: 15 });
              $state.go("/");
          });
      }, 3000);
  }

  $scope.back = function(){
    window.history.back();
  }
}]);

app.controller('Index', ['$scope' ,'$http' , '$state' , 'ipCookie' , function($scope,$http,$state,ipCookie){
  var ctrl = this;
  ctrl.init = function(){
      ctrl.greeting = 'Welcome!';
      $scope.remember = true;
      if(ipCookie("cookieLogin"))
      {
        $http.get("/api/users/"+ipCookie("cookieLogin").oppai_name)
        .success(function(data){
          ctrl.userinfo = true;
          ctrl.admin = data[0].permission;
          ctrl.name = data[0].oppai_name;
          ctrl.avatar = data[0].avatar;
          $state.go("/");
        })
      }
  }
    ctrl.login = function(data){
      var hashPassword = calcSHA1(data.password);
    $http.post("/api/login/",data)
    .then(function successCallback(response) {
      if(response.data[0] != undefined)
      {
        if(response.data[0].password == hashPassword)
        {
          if($scope.remember === true)
          {
            ctrl.userinfo = true;
            ctrl.admin = response.data[0].permission;
              ctrl.name = response.data[0].oppai_name;
              ctrl.avatar = response.data[0].avatar;
              ipCookie("cookieLogin", response.data[0], { expires: 15 });
            }
            else
            {
              ctrl.userinfo = true;
              ctrl.admin = response.data[0].permission;
              ctrl.name = response.data[0].oppai_name;
              ctrl.avatar = response.data[0].avatar;
              ipCookie("cookieLogin", response.data[0], { expires: 1 });
            }
        }
        else
        {
          $scope.data.password = null;
          $scope.passwordPass = false;
          $scope.emailPass = true;
          setTimeout(function () {
                  $scope.$apply(function () {
              $scope.passwordPass = 'default';
                  });
              }, 2000);
        }
      }
      else
      {
        $scope.emailPass = false;
        $scope.data.password = null;
        $scope.data.email = null;
        setTimeout(function () {
              $scope.$apply(function () {
            $scope.emailPass = 'default';
              });
          }, 2000);
      }

      
    }, function errorCallback(response) {
      console.log(response.message)
    });
  }
  $scope.logout = function(){
    ctrl.userinfo = false;
    ctrl.name = null;
    ctrl.avatat = null;
    ipCookie.remove("cookieLogin");
    $state.go("/");
  }
}]);

app.controller('Backend', ['$scope' ,'$http' , '$state' , 'ipCookie' , function($scope,$http,$state,ipCookie){
  var ctrl = this;
  ctrl.init = function(){
    $scope.data = {
      availableOptions: [
        {id: '1', name: 'ยังไม่จบ'},
        {id: '2', name: 'จบแล้ว'}
      ],
      status: {id: '1', name: 'ยังไม่จบ'} //This sets the default value of the select in the ui
    };
    if(ipCookie("cookieLogin"))
    {
      $http.get("/api/users/"+ipCookie("cookieLogin").oppai_name)
        .success(function(data){
          if(data[0].permission <4)
            $state.go("/");
          else
            ctrl.hello = "Hi Administrator " + data[0].oppai_name;
        });
    }
    ctrl.anime();
  }
  ctrl.hover = function(){
    var audio = new Audio('/sound/Pop.mp3');
    audio.volume = 0.1;
    audio.play();
  };

  ctrl.post = function(data){
    var formData = new FormData();
    formData.append('image', data.cover.file, data.cover.file.name);
    $http.post('/api/upload/cover_anime', formData, {
      headers: { 'Content-Type': false },
      transformRequest: angular.identity
    }).success(function(result) {
        data.cover = result.path
        $http.post('/api/anime/create',data) // insert anime
        .then(function successCallback(response){
          $scope.data.topic = null;
          $scope.data.detail = null;
          $scope.data.cover = null;
          ctrl.anime();
        })
    }); 
  };

  ctrl.anime = function(){
    $http.get('/api/anime')
    .success(function(data){
      ctrl.allAnime = data;
    });
  }
}]);