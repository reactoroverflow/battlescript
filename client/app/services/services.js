angular.module('battlescript.services', [])

////////////////////////////////////////////////////////////
// Auth factory
// 
// This takes care of all things auth related:
// 
// - user sign in
// - user sign up
// - user is authenticated
// - user logged out
////////////////////////////////////////////////////////////

.factory('Auth', function ($http, $location, $window) {
  
  // signs users in
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      // Saving a global username to be used throughout app
      $window.localStorage.setItem('username', resp.config.data.username);
      return resp.data.token;
    });
  };

  // signs users up
  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      // Saving a global username to be used throughout app
      $window.localStorage.setItem('username', resp.config.data.username);
      return resp.data.token;
    });
  };

  // helper to check if users are authorized
  var isAuth = function () {
    return !!$window.localStorage.getItem('battlepro');
  };

  // signs out users
  var signout = function (user) {
    $window.localStorage.setItem('username', undefined);
    $window.localStorage.removeItem('battlepro');
    $location.path('/signin');
    
    return $http({
      method: 'POST',
      url: '/api/users/signout',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });

  };

  // return all funcs as an obj
  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})

////////////////////////////////////////////////////////////
// Users factory
// 
// Handles all things to do with users:
// 
// - fetching the currently logged in user
// - fetching online users
// - fetching all users
////////////////////////////////////////////////////////////

.factory('Users', function($http) {

  // gets the currently logged in user
  var getAuthUser = function() {
    return window.localStorage.getItem('username');
  };

  var getStats = function(username) {
    return $http({
      method: 'GET',
      url: '/api/users/stats',
      params: {username: username}  
    }).then(function(res) {
      return res.data;
    });
  };

  var statChange = function(username, winIncrease) {
    return $http({
      method: 'POST',
      url: '/api/users/statchange',
      data: {username: username, winIncrease: winIncrease}
    });
  };

  //send avatar to server
  var avatarChange = function(username, avatar) {
    // console.log("i am in services trying to sent a POST req to server");
    return $http({
      method: 'POST',
      url: '/api/users/avatarchange',
      data: {username: username, avatar: avatar}
    });
  };

  var setFbId = function(username, fbId) {
    // console.log("i am in services trying to sent a POST req to server");
    return $http({
      method: 'POST',
      url: '/api/users/setfbid',
      data: {username: username, fbId: fbId}
    });
  };

  var setFriend = function(username, friendusername) {
    // console.log("i am in setFriend sending a POST req");
    return $http({
      method: 'POST',
      url: '/api/users/setfriend',
      data: {username: username, friendusername: friendusername}
    });
  };

  var getFriendUsername = function(fbId) {
    // console.log("Inside getFriendUsername");
    return $http({
      method: 'GET',
      url: '/api/users/getfriend',
      params: {fbId: fbId}  
    })
    // .then(function(res) {
    //   console.log("Each response (services.js) ===> ", res.data.username);
    //   return res.data.username;
    // });
  };

  var pointsChange = function(username, pointIncrease) {
    // console.log(username, pointIncrease);
    return $http({
      method: 'POST',
      url: '/api/users/pointschange',
      data: {username: username, pointIncrease: pointIncrease}
    });
  };

  var getLeaderboard = function(){
    return $http({
      method: 'GET',
      url: '/api/users/leaderboard'
    });
  };

  return {
    getAuthUser: getAuthUser,
    getStats: getStats,
    statChange: statChange,
    pointsChange: pointsChange,
    avatarChange: avatarChange,
    getLeaderboard: getLeaderboard,
    setFbId: setFbId,
    getFriendUsername: getFriendUsername,
    setFriend: setFriend
  };
})

////////////////////////////////////////////////////////////
// Sockets factory
// 
// A set of reusable functions to handle socket connections
// inside various controllers
////////////////////////////////////////////////////////////

.factory('Socket', function() {

  // creates a new socket base on the passed in params. Params
  // is an array of relationships, where each relationship is a
  // key pair value in string format
  var createSocket = function(route, params) {
    var query = params.join('&');
    return io.connect('http://localhost:8000/#/' + route, {
      query: query,
      'force new connection': true
    });
  };

  return {
    createSocket: createSocket
  };
})

////////////////////////////////////////////////////////////
// Notifications factory
// 
// A set of reusable functions to handle user notifications
// throughout the app
////////////////////////////////////////////////////////////

.factory('Notifications', function() {
  return {};
})

////////////////////////////////////////////////////////////
// Dashboard factory
// 
// Handles all things on the user dashboard. Might be
// factored out depending on the state of the Users 
// factory
////////////////////////////////////////////////////////////

.factory('Dashboard',function ($http){
  return {};
})

////////////////////////////////////////////////////////////
// Battle factory
// 
// Handles all things to do when users engage in a battle
// against each other:
// 
// - get battle, gets a battle from the api
// - attempt battle, for when users attempt a solution
// - submit battle, for when a user wants to submit a 
//   final solution for a battle
////////////////////////////////////////////////////////////

.factory('Battle', function($http) {

  // checks if valid battle room
  var isValidBattleRoom = function(hash) {
    return $http({
      method: 'POST',
      url: '/api/battles/checkvalidbattleroom',
      data: {hash: hash}
    }).then(function(res) {
      return res.data;
    });
  };

  // gets a battle
  var getBattle = function(battleHash) {
    return $http({
      method: 'POST',
      url: '/api/duels/getduel',
      data: {battleHash: battleHash}
    }).then(function(res) {
      return res.data;
    });
  };

  // attempts a battle
  var attemptBattle = function(projectId, solutionId, code) {
    return $http({
      method: 'POST',
      url: '/api/duels/attemptduel',
      data: {
        code: code,
        projectId: projectId,
        solutionId: solutionId
      }
    }).then(function(res) {
      return res.data;
    });
  };

  return {
    isValidBattleRoom: isValidBattleRoom,
    getBattle: getBattle,
    attemptBattle: attemptBattle
  };
})

////////////////////////////////////////////////////////////
// Collab factory
// 
// Handles all things to do when users engage in a collab
// against each other:
// 
// - get collab, gets a collab from the api
// - attempt collab, for when users attempt a solution
// - submit collab, for when a user wants to submit a 
//   final solution for a collab
////////////////////////////////////////////////////////////

.factory('Collab', function($http) {

  // checks if valid collab room
  var isValidCollabRoom = function(hash) {
    return $http({
      method: 'POST',
      url: '/api/collab/checkvalidcollabroom',
      data: {hash: hash}
    }).then(function(res) {
      return res.data;
    });
  };

  // gets a collab
  var getCollab = function(collabHash) {
    return $http({
      method: 'POST',
      url: '/api/collabs/getcollab',
      data: {collabHash: collabHash}
    }).then(function(res) {
      return res.data;
    });
  };

  // attempts a battle
  var attemptCollab = function(projectId, solutionId, code) {
    return $http({
      method: 'POST',
      url: '/api/collabs/attemptcollab',
      data: {
        code: code,
        projectId: projectId,
        solutionId: solutionId
      }
    }).then(function(res) {
      return res.data;
    });
  };

  return {
    isValidCollabRoom: isValidCollabRoom,
    getCollab: getCollab,
    attemptCollab: attemptCollab
  };
})

////////////////////////////////////////////////////////////
// Editor factory
// 
// Handles all things to do with setting up CodeMirror
// editors
////////////////////////////////////////////////////////////

.factory('Editor', function() {

  // makes a CodeMirror editor
  var makeEditor = function(el, readOnly) {
    if (readOnly === true) { readOnly = 'nocursor'; }

    return CodeMirror.fromTextArea(document.querySelector(el), {
      mode: 'javascript',
      theme: 'material',
      indentUnit: 2,
      tabSize: 2,
      lineNumbers: true,
      readOnly: readOnly
    });
  };

  return {
    makeEditor: makeEditor
  };

})


.factory('facebookService', function($q) {

  var getMyLastName = function() {
    var deferred = $q.defer();
    FB.api('/me', {
      fields: 'last_name'
    }, function(response) {
      if (!response || response.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(response);
      }
    });
    return deferred.promise;
  };

  var getUserID = function() {
    var deferred = $q.defer();
    FB.api('/me', {
      fields: 'id'
    }, function(response) {
      if (!response || response.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(response.id);
      }
    });
    return deferred.promise;
  };

  var getUserImg = function(userID) {
    var deferred = $q.defer();
    FB.api('/' + userID + '/picture', function(response) {
      if (!response || response.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(response.data.url);
      }
    });
    return deferred.promise;
  };

  var getFriends = function() {
    var deferred = $q.defer();
    FB.api('/me/friends', function(response) {
      if (!response || response.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(response.data);
      }
    });
    return deferred.promise;
  };

  return {
    getMyLastName: getMyLastName,
    getUserID: getUserID,
    getUserImg: getUserImg,
    getFriends: getFriends
  };

});
