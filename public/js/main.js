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
  $stateProvider
    .state('editanime', {
      url: "/backend/anime/:id",
      templateUrl: "./backend/editAnime.html",
      controller: 'EditAnime as ctrl'
    })
  $stateProvider
    .state('anime', {
      url: "/anime/:id",
      templateUrl: "./templates/anime.html",
      controller: 'viewAnime as ctrl'
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
    $http.get('/api/anime')
    .success(function(data){
      ctrl.anime = data;
    });
    setInterval(function(){
      $http.get('/api/anime')
      .success(function(data){
        ctrl.anime = data;
      });
    },60000);
    
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
          {
            ctrl.hello = "Hi ~~~  " + data[0].oppai_name;
            // temp 
            var currentdate = new Date(); 
            var datetime = currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();            
            $http.get('https://api.ipify.org?format=json')
            .success(function(ip){
              var temp = {"oppai_name":ipCookie("cookieLogin").oppai_name,
              "action":"Login Backend By : "+data[0].oppai_name,
              "ip":ip.ip,
              "date_time":datetime};
              $http.post('/api/temp',temp)
              .success(function(data){
                ctrl.temp();
              });
            });
          }
        });
    }
    ctrl.anime();
    ctrl.limit = 0;
    ctrl.total_more = 0;
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

    // temp 
    var currentdate = new Date(); 
    // var datetime = "Last Sync: " + currentdate.getDate() + "/"
    //             + (currentdate.getMonth()+1)  + "/" 
    //             + currentdate.getFullYear() + " @ "  
    var datetime = currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();          
    $http.get('https://api.ipify.org?format=json')
    .success(function(ip){
      var temp = {"oppai_name":ipCookie("cookieLogin").oppai_name,
      "action":"Create Anime : "+data.topic,
      "ip":ip.ip,
      "date_time":datetime};
      $http.post('/api/temp',temp)
      .success(function(data){

      });
    });
  };

  ctrl.anime = function(){
    $http.get('/api/anime')
    .success(function(data){
      ctrl.allAnime = data;
    });
  }

  ctrl.select_anime = function(anime_id,name){
    ctrl.showEpisode = true;
    ctrl.anime_name = name;
    $scope.anime_id = anime_id;
    $scope.search_anime = "";
    ctrl.getEpisode(anime_id);

    $scope.episode = {
      availableOptions: [
        {id: '1', name: 'facebook'},
        {id: '2', name: 'googleDrive'}
      ],
      type: {id: '1', name: 'facebook'} //This sets the default value of the select in the ui
    };
  }
  ctrl.getEpisode = function(anime_id){
    $http.get('/api/anime/episode/'+anime_id)
    .success(function(data){
      ctrl.episode = data;
    });
  }
  ctrl.delete = function(anime_id,ep){
    $http.delete("/api/anime/episode/del/"+anime_id+"/"+ep)
    .success(function(data){
      ctrl.getEpisode($scope.anime_id);
    });
    // temp 
    var currentdate = new Date(); 
    var datetime = currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();            
    $http.get('https://api.ipify.org?format=json')
    .success(function(ip){
      var temp = {"oppai_name":ipCookie("cookieLogin").oppai_name,
      "action":"Delete Anime : "+ctrl.anime_name+ " EP : "+ep,
      "ip":ip.ip,
      "date_time":datetime};
      $http.post('/api/temp',temp)
      .success(function(data){
        // console.log(data)
      });
    });
  };
  ctrl.post_ep = function(data){
    var obj = [];
    obj.push({"anime_id":$scope.anime_id,"ep":data.ep,"type":data.type,"url":data.url});
    $http.post('/api/anime/episode/',obj)
    .success(function(data){
      ctrl.getEpisode($scope.anime_id);
    });

    // temp 
    var currentdate = new Date(); 
    var datetime = currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();            
    $http.get('https://api.ipify.org?format=json')
    .success(function(ip){
      var temp = {"oppai_name":ipCookie("cookieLogin").oppai_name,
      "action":"Update Anime : "+ctrl.anime_name+ " EP : "+data.ep,
      "ip":ip.ip,
      "date_time":datetime};
      $http.post('/api/temp',temp)
      .success(function(data){
        // console.log(data)
      });
    });
  }

  ctrl.temp = function(){
    $http.get('/api/temp')
    .success(function(data){
      ctrl.data_temp = data;
      ctrl.limit=ctrl.limit+20;
      if(ctrl.total_more>=0)
        ctrl.total_more = ctrl.data_temp.length-ctrl.limit;
      if(ctrl.total_more<0)
        ctrl.total_more =0;
    });
  }
  ctrl.clear = function(){
    if(ipCookie("cookieLogin").permission<5)
      alert("Access Deny By WebMaster");
    else{
      $http.delete('/api/temp')
      .success(function(data){
        ctrl.temp();
      });
    }
  }

}]);



app.controller('EditAnime', ['$scope' ,'$http' , '$state' , 'ipCookie' ,'$stateParams', function($scope,$http,$state,ipCookie,$stateParams){
  var ctrl = this;
  ctrl.init = function(){
   if(ipCookie("cookieLogin"))
    {
      $http.get("/api/users/"+ipCookie("cookieLogin").oppai_name)
        .success(function(data){
          if(data[0].permission <4)
            $state.go("/");
          else
            ctrl.hello = "Hi ~~~ " + data[0].oppai_name;
        });
    }
    $http.get('/api/anime/'+$stateParams.id)
    .success(function(data){
      $scope.data = data[0];
    })
  }

  ctrl.edit = function(data){
    // temp 
    var currentdate = new Date(); 
    var datetime = currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();            
    $http.get('https://api.ipify.org?format=json')
    .success(function(ip){
      var temp = {"oppai_name":ipCookie("cookieLogin").oppai_name,
      "action":"Edit Anime : "+data.topic,
      "ip":ip.ip,
      "date_time":datetime};
      $http.post('/api/temp',temp)
      .success(function(data){
        // console.log(data)
      });
    });

    $http.put('/api/anime/',data)
    .success(function(data){
      //window.location.reload();
    });
    
  }
  ctrl.delete = function(anime_id,topic){
    // temp 
    var currentdate = new Date(); 
    var datetime = currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();            
    $http.get('https://api.ipify.org?format=json')
    .success(function(ip){
      var temp = {"oppai_name":ipCookie("cookieLogin").oppai_name,
      "action":"Delete Anime : "+topic,
      "ip":ip.ip,
      "date_time":datetime};
      $http.post('/api/temp',temp)
      .success(function(data){
        // console.log(data)
      });
    });

    $http.delete("/api/anime/"+anime_id)
    .success(function(data){
      window.history.back();
    });
  };
  ctrl.back = function(){
    window.history.back();
  }

}]);

app.controller('viewAnime',function($scope,$http,$stateParams){
  var ctrl = this;
  ctrl.init = function(){
    $http.get('/api/anime/'+$stateParams.id)
    .success(function(data){
      $scope.data = data[0];
      $("#detail").append(data[0].detail)
    })
    $http.get('/api/anime/episode/'+$stateParams.id)
    .success(function(data){
      ctrl.episode = data;
    });
  }
});