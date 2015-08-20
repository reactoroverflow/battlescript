angular.module('battlescript.settings', [])

.controller('SettingsController', function ($scope, $rootScope, $timeout, Dashboard, Users, Battle, facebookService) {
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
        $scope.user_ID = response;
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
        $scope.fbFriends = response;
      }
    );
  };
  
});
