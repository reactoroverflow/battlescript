angular.module('battlescript.settings', [])

.controller('SettingsController', function ($scope, $rootScope, $timeout, Dashboard, Users, Battle, Collab, facebookService) {
  // get current auth username
  $scope.username = Users.getAuthUser();

  // this gets passed into the directive.
  // it definitely needs to be refactored depending on what happens
  // up above.
  $scope.userInfo = {username: $scope.username};

  $scope.getMyLastName = function() {
    facebookService.getMyLastName() 
      .then(function(response) {
        $scope.last_name = response.last_name;
      }
    );
  };

  $scope.getUserID = function() {
    facebookService.getUserID() 
      .then(function(response) {
        return response;
      }
    );
  };

  $scope.getUserImg = function(userID) {
    facebookService.getUserImg(userID) 
      .then(function(response) {
        $scope.user_Img = response;
      }
    );
  };

  $scope.getFriends = function() {
    facebookService.getFriends() 
      .then(function(response) {
        // $rootScope.fbFriends = response;
        return response;
      }
    );
  };

  $scope.doAllTheThings = function() {
    // console.log("I AM IN DOALLTHETHINGS!");
    facebookService.getUserID() 
      .then(function(response) {
        // console.log(response);
        Users.setFbId($scope.username, response)
          .then(function() {
            // console.log("After the second .thennnnnnnnnNn");
            facebookService.getFriends() 
              .then(function(response) {
                _.each(response, function(user) {
                  // console.log("EACH USER: ===> ", user)
                  Users.getFriendUsername(user.id)
                    .then(function(res) {
                      // console.log("res.data.username", res.data.username);
                      // send this username into friends array of user
                      Users.setFriend($scope.username, res.data.username)
                        .then(function(res) {
                          // console.log("YOU DID IT!");
                        });
                    });
                });
                $('.friends_success').show();
              });
          });
      });

  };
  
});
