angular.module('battlescript.dashboard', [])

.controller('DashboardController', function ($scope, $rootScope, $timeout, Dashboard, Users, Battle, Collab) {
  // get current auth username
  $scope.username = Users.getAuthUser();

  // this gets passed into the directive.
  // it definitely needs to be refactored depending on what happens
  // up above.
  $scope.userInfo = {username: $scope.username};

  $scope.nightmare = function() {
    $scope.challengeLevel = 0 + Math.floor(Math.random()*2);
    $scope.challengeLevelDesc = 'NIGHTMARE!!!';
  };
  $scope.hard = function() {
    $scope.challengeLevel = 2 + Math.floor(Math.random()*2);
    $scope.challengeLevelDesc = 'FREAKISHLY HARD!!!';
  };
  $scope.meh = function() {
    $scope.challengeLevel = 4 + Math.floor(Math.random()*2);
    $scope.challengeLevelDesc = 'Mehhhhh...I got this.';
  };
  $scope.cake = function() {
    $scope.challengeLevel = 6 + Math.floor(Math.random()*2);
    $scope.challengeLevelDesc = 'This should be cake!';
  };
  $scope.superNewb = function() {
    $scope.challengeLevel = 8;
    $scope.challengeLevelDesc = 'Easy mode enabled.';
  };

  // Set up all dashboard info.
  $scope.challengeLevel = 6 + Math.floor(Math.random()*3);
  $scope.challengeLevelDesc = 'This should be cake!';
  $scope.currentStreak = 0;
  $scope.longestStreak = 0;
  $scope.totalWins = 0;
  $scope.totalPoints = 0;
  $scope.leaderboard = [];
  $scope.challengeClicked = {};
  $scope.collaborateClicked = {};

  ////////////////////////////////////////////////////////////
  // sets up all the dashboard stuff here
  ////////////////////////////////////////////////////////////

  // this defaults to false, because when the page first loads, there is 
  // no battle request for the logged in user
  $scope.userHasBattleRequest = false;

  // battle request status can be 'none', 'open', or 'init'. it defaults
  // to none, changes to open when a request is first sent, and changes to
  // init if the user accepts/declines the battle request.
  $scope.battleRequestStatus = 'none';

  // this defaults to null, because by default, no opponents have challenged
  // the logged in user
  $scope.battleRequestOpponentName = null;

  // Set up a unique hash for battling.
  $scope.battleRoomHash;

  // this defaults to false, because when the page first loads, there is 
  // no battle request for the logged in user
  $scope.userHasCollabRequest = false;

  // battle request status can be 'none', 'open', or 'init'. it defaults
  // to none, changes to open when a request is first sent, and changes to
  // init if the user accepts/declines the battle request.
  $scope.collabRequestStatus = 'none';

  // this defaults to null, because by default, no opponents have challenged
  // the logged in user
  $scope.collabRequestOpponentName = null;

  // Set up a unique hash for battling.
  $scope.collabRoomHash;

  ////////////////////////////////////////////////////////////
  // set up online users
  ////////////////////////////////////////////////////////////

  $scope.onlineUsers;

  $rootScope.dashboardSocket.on('updateUsers', function(data) {
    //TODO: Online users.

    // console.log('NEED TO UPDATE USERS CUZ OF SOME EVENT');
    // console.log(data);

    if (data[$scope.username]) {
      delete data[$scope.username];
    }

    $scope.onlineUsers = data;
    $scope.$apply();

  });

  ////////////////////////////////////////////////////////////
  // friends
  ////////////////////////////////////////////////////////////
  $scope.friends = {cody: 'daig', andrew: 'kishino', lina: 'lu'};

  ////////////////////////////////////////////////////////////
  // set an avatar for a user
  ////////////////////////////////////////////////////////////

  $scope.avatars = [{
    'img': 'http://www.iosdevjournal.com/wp/wp-content/uploads/2011/12/NerdsGeeksGurus_individualsGEEK.png',
    'name': 'Tyrion'
    }, {
    'img': 'http://www.iosdevjournal.com/wp/wp-content/uploads/2011/12/NerdsGeeksGurus_individualsNERD.png',
    'name': 'Theon'
    }, {
    'img': 'http://s3.picofile.com/file/7819333759/large2.gif',
    'name': 'Arya'
    }, {
    'img': 'http://www.discordia.com.au/wp-content/uploads/2012/10/weapon_keyboard__by_slayeroflight1307-d5cxhj5.png',
    'name': 'Varys'
    }, {
    'img': 'http://fc00.deviantart.net/fs70/i/2011/087/1/3/young_nerd_by_costalonga-d3co1j3.png',
    'name': 'Samwell'
    }, {
    'img': 'http://vignette3.wikia.nocookie.net/mafiawars/images/4/4a/Huge_item_keyboardwarrior_bronze_01.png/revision/latest?cb=20121126091224',
    'name': 'Joffrey'
    }, {
    'img': 'http://orig15.deviantart.net/33d6/f/2011/058/e/1/hello_kitty_nerd_by_ladypinkilicious-d3ajpii.png',
    'name': 'Melisandre'
    }, {
    'img': 'http://www.designtickle.com/cdnmedia/-/2012/07/design-code-html5-web-development/20-yootheme-illustration-html5-nerd.png',
    'name': 'Jaqen'
    }, {
    'img': 'http://www.pubzi.com/f/lg-geek-nerd-smiley-surprise-emoticon.png',
    'name': 'Tywin'
    }
  ];
  $scope.my = {
    favorite: ''
  };

  $scope.toShowImagePreview = false;
    
  $scope.showImagePreviewFn = function() {
    $scope.toShowImagePreview = true;
  };

  $scope.avatar = '';
  // console.log("$scope.avatar", $scope.avatar);

  $scope.setAvatar = function() {
    Users.avatarChange($scope.username, $scope.my.favorite.img)
      .then(function() {
    });
    $scope.toShowImagePreview = false;
    $scope.getStats($scope.username);
  };

  ////////////////////////////////////////////////////////////
  // get user stats for dashboard
  ////////////////////////////////////////////////////////////

  $scope.getStats = function(username) {
    // console.log("getting stats!");
    Users.getStats(username)
      .then(function(stats){
        // console.log("here are the stats === ", stats);
        $scope.currentStreak = stats.currentStreak;
        $scope.longestStreak = stats.longestStreak;
        $scope.totalWins = stats.totalWins;
        $scope.avatar = stats.avatar;
        $scope.totalPoints = stats.totalPoints;
      });
  };

  $scope.getStats($scope.username);

  ////////////////////////////////////////////////////////////
  // get user stats for leaderboard
  ////////////////////////////////////////////////////////////

  $scope.getLeaderboard = function(username) {
    // $scope.leaderboard = Users.getLeaderboard();
    Users.getLeaderboard()
      .then(function(leaderboard){ 
        $scope.leaderboard = leaderboard.data;
        // console.log($scope.leaderboard);
      });
  };

  $scope.getLeaderboard();

  ////////////////////////////////////////////////////////////
  // handle collaboration requests
  ////////////////////////////////////////////////////////////

  // Open up socket with specific dashboard server handler
  $scope.requestCollab = function($event, opponentUsername) {
    $event.preventDefault();
    $scope.collaborateClicked[opponentUsername] = true;
    if (!$scope.challengeLevel) $scope.challengeLevel = 4 + Math.floor(Math.random()*2);
    // console.log("CHALLENGE LEVEL: ", $scope.challengeLevel);


    // now, we need to emit to the socket
    $rootScope.dashboardSocket.emit('outgoingCollabRequest', {
      fromUser: $scope.username,  // request from the logged in user
      toUser: opponentUsername,    // request to the potential opponent
      challengeLevel: $scope.challengeLevel
    });
  };

  // listen for incoming collab request
  $rootScope.dashboardSocket.on('incomingCollabRequest', function(userData){
    $scope.collabRequestOpponentName = userData.fromUser;
    $scope.collabRequestChallengeLevel = userData.challengeLevel;
    $scope.userHasCollabRequest = true;
    $scope.collabRequestStatus = 'open';
    $scope.$apply();
  });

  // collab has been accepted
  $scope.collabAccepted = function() {
    // console.log("CHALLENGE ACCEPTED, CHALLENGE LEVEL: ", $scope.battleRequestChallengeLevel);
    // need to somehow notify challenger that the battle has been accepted
    $rootScope.dashboardSocket.emit('collabAccepted', {
      user: $scope.username,                      // the user who accepted the battle
      opponent: $scope.collabRequestOpponentName,  // the opponent needs to be notified
      challengeLevel: $scope.collabRequestChallengeLevel
    });
  };

  // collab has been declined
  $scope.collabDeclined = function() {
    // Reset everything :)
    $scope.userHasCollabRequest = false;
    $scope.collabRequestStatus = 'none';
  };

  $rootScope.dashboardSocket.on('prepareForCollab', function(data) {
    // at this point, the opponent (i.e. the person who sent the initial battle
    // request) should be notified that the person he/she challenged has
    // accepted.
    // console.log('prepare for battle!', data);

    $scope.collabRoomHash = data.roomhash;

    // a notification should pop up on both screens
    $scope.userHasCollabRequest = true;
    $scope.collabRequestStatus = 'init';
    $scope.$apply();
    
    // the url hash needs to also be sent to the player who accepted the
    // challenge
  });


  ////////////////////////////////////////////////////////////
  // handle battle requests
  ////////////////////////////////////////////////////////////

  // Open up socket with specific dashboard server handler
  $scope.requestBattle = function($event, opponentUsername) {
    $event.preventDefault();
    $scope.challengeClicked[opponentUsername] = true;
    if (!$scope.challengeLevel) $scope.challengeLevel = 4 + Math.floor(Math.random()*2);
    // console.log("CHALLENGE LEVEL: ", $scope.challengeLevel);


    // now, we need to emit to the socket
    $rootScope.dashboardSocket.emit('outgoingBattleRequest', {
      fromUser: $scope.username,  // request from the logged in user
      toUser: opponentUsername,    // request to the potential opponent
      challengeLevel: $scope.challengeLevel
    });
  };

  // listen for incoming battle request
  $rootScope.dashboardSocket.on('incomingBattleRequest', function(userData){
    $scope.battleRequestOpponentName = userData.fromUser;
    $scope.battleRequestChallengeLevel = userData.challengeLevel;
    $scope.userHasBattleRequest = true;
    $scope.battleRequestStatus = 'open';
    $scope.$apply();
    // console.log("opponent has challenged you: ", userData.fromUser);
  });

  // battle has been accepted
  $scope.battleAccepted = function() {
    // console.log("CHALLENGE ACCEPTED, CHALLENGE LEVEL: ", $scope.battleRequestChallengeLevel);
    // need to somehow notify challenger that the battle has been accepted
    $rootScope.dashboardSocket.emit('battleAccepted', {
      user: $scope.username,                      // the user who accepted the battle
      opponent: $scope.battleRequestOpponentName,  // the opponent needs to be notified
      challengeLevel: $scope.battleRequestChallengeLevel
    });
  };

  // battle has been declined
  $scope.battleDeclined = function() {
    // Reset everything :)
    $scope.userHasBattleRequest = false;
    $scope.battleRequestStatus = 'none';
  };

  // prepare for battle, only gets fired when a user has sent a battle request,
  // and another user has accepted.
  $rootScope.dashboardSocket.on('prepareForBattle', function(data) {
    // at this point, the opponent (i.e. the person who sent the initial battle
    // request) should be notified that the person he/she challenged has
    // accepted.
    // console.log('prepare for battle!', data);

    $scope.battleRoomHash = data.roomhash;

    // a notification should pop up on both screens
    $scope.userHasBattleRequest = true;
    $scope.battleRequestStatus = 'init';
    $scope.$apply();
    
    // the url hash needs to also be sent to the player who accepted the
    // challenge
  });
  
});
