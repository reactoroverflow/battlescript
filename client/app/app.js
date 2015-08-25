////////////////////////////////////////////////////////////
// bootstrap the app and all services and controllers
////////////////////////////////////////////////////////////
var FB;
angular.module('battlescript', [
  'battlescript.services',
  'battlescript.auth',
  'battlescript.home',
  'battlescript.dashboard',
  'battlescript.settings',
  'battlescript.battle',
  'battlescript.collab',
  'ui.router',
  'ngSanitize'
])

////////////////////////////////////////////////////////////
// config the app states
////////////////////////////////////////////////////////////

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .state('logout', {
      url: '/logout',
      templateUrl: 'app/auth/logout.html',
      controller: 'AuthController'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController',
      authenticate: true
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'app/settings/settings.html',
      controller: 'SettingsController',
      authenticate: true
    })
    .state('battleroom', {
      url: '/battle/:id',
      templateUrl: 'app/battle/battle.html',
      controller: 'BattleController',
      authenticate: true
    })
    .state('collabroom', {
      url: '/collab/:id',
      templateUrl: 'app/collab/collab.html',
      controller: 'CollabController',
      authenticate: true
    });

    $urlRouterProvider.otherwise('/');
})

////////////////////////////////////////////////////////////
// config the app tokens
////////////////////////////////////////////////////////////

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AttachTokens');
})

////////////////////////////////////////////////////////////
// set up app factory for attaching tokens
////////////////////////////////////////////////////////////

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('battlepro');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

////////////////////////////////////////////////////////////
// boot up app directives
// 
// - headerMain: the main header bar for auth'd users
// - headerLogout: a directive specifically for logout
// - headerNoAuthPartial: a directive for rendering a static
//   HTML header on the signup/signin pages
// - footerPartial: a static html directive for the footer
////////////////////////////////////////////////////////////

.directive('headerMain', function() {
  return {
    restrict: 'E',
    scope: {
      userInfo: '=userInfo'
    },
    templateUrl: 'app/directives/header-main.html'
  };
})

.directive('headerLogout', function() {
  var link = function(scope, element, attrs) {
    element.bind('click', function(e) {
      e.preventDefault();
      scope.$parent.$apply(attrs.logout);
    });
  };

  return {
    link: link,
    restrict: 'E',
    templateUrl: 'app/directives/header-logout.html'
  };
})

.directive('headerNonAuthPartial', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/header-nonauth.html'
  };
})

.directive('footerPartial', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/footer.html'
  };
})

// live updates the css styling in collab.html
.directive('parseStyle', function($interpolate) {
    return function(scope, elem) {
        var exp = $interpolate(elem.html()),
            watchFunc = function () { return exp(scope); };
        
        scope.$watch(watchFunc, function (html) {
            elem.html(html);
        });
    };
})

.directive("fbLoginButton", function() {
    
    return {
        restrict: 'E',
        link: function (scope, iElement, iAttrs) {
            if (FB) {
                FB.XFBML.parse(iElement[0].parent);
            }
        }
    }
})

////////////////////////////////////////////////////////////
// run the style
////////////////////////////////////////////////////////////

.run(function ($rootScope, $window, $location, Auth, Users, Socket) {

////////////////////////////////////////////////////////////
// Facebook auth init
////////////////////////////////////////////////////////////

  // $rootScope.user = {};

  $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded
    FB.init({ 
      appId: '948893565174149', 
      channelUrl: 'auth/channel.html', /* Adding a Channel File improves the performance of the javascript SDK */
      status: true,   /* Set if you want to check the authentication status at the start up of the app */
      cookie: true,   /* Enable cookies to allow the server to access the session */
      xfbml: true,    /* Parse XFBML */
      version: 'v2.4'
    });
  };

  (function(d){
    // load the Facebook javascript SDK
    var js, 
    id = 'facebook-jssdk', 
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script'); 
    js.id = id; 
    js.async = true;
    js.src = "//connect.facebook.net/en_US/sdk.js";

    ref.parentNode.insertBefore(js, ref);
  }(document));


  ////////////////////////////////////////////////////////////
  // dashboard sockets
  ////////////////////////////////////////////////////////////

  // start it up but leave it empty
  $rootScope.dashboardSocket;
  
  // only create socket first time when auth and hits dash
  $rootScope.$on('$stateChangeStart', function(evt, next, current) {
    if (next && Auth.isAuth() && next.name === 'dashboard' && !$rootScope.dashboardSocket) {
      $rootScope.dashboardSocket = Socket.createSocket('dashboard', [
        'username=' + Users.getAuthUser(),
        'handler=dashboard'
      ]);

      $rootScope.dashboardSocket.on('connect', function() {
        $rootScope.initDashboardSocketEvents();
      });
    }
  });

  // initialise dash socket events
  $rootScope.initDashboardSocketEvents = function() {
    // state change and socket handling
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      if (next.name !== 'dashboard') {
        $rootScope.dashboardSocket.disconnect();
      } else if (next.name === 'dashboard') {
        $rootScope.dashboardSocket.connect();
      }
    });

    // listen for socket disconnection
    $rootScope.dashboardSocket.on('disconnect', function() {
      // console.log('socket disconnected');
    });
  };

  ////////////////////////////////////////////////////////////
  // battle sockets
  ////////////////////////////////////////////////////////////

  $rootScope.battleSocket;

  $rootScope.initBattleSocket = function(roomhash, cb) {
    
    // still check here
    if (Auth.isAuth() /* && !$rootScope.battleSocket */) {
      // now time to set up the battle socket
      $rootScope.battleSocket = Socket.createSocket('battle', [
        'username=' + Users.getAuthUser(),
        'handler=battle',
        'roomhash=' + roomhash
      ]);

      $rootScope.battleSocket.on('connect', function() {
        $rootScope.initBattleSocketEvents(cb);
      });
    }
  };

  // initialise dash socket events
  $rootScope.initBattleSocketEvents = function(cb) {
    // console.log('init the battle events');
    // state change and socket handling
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      if (next.name !== 'battleroom') {
        $rootScope.battleSocket.emit('disconnectedClient', {username: Users.getAuthUser()});
        $rootScope.battleSocket.disconnect();
      }
    });

    // refresh handler
    window.onbeforeunload = function(e) {
      $rootScope.battleSocket.emit('disconnectedClient', {username: Users.getAuthUser()});
      $rootScope.battleSocket.disconnect();
    };

    // listen for socket disconnection
    $rootScope.battleSocket.on('disconnect', function() {
      // console.log('battle socket disconnected');
    });

    // run the callback
    cb();
  };


  ////////////////////////////////////////////////////////////
  // battle sockets
  ////////////////////////////////////////////////////////////

  $rootScope.collabSocket;

  $rootScope.initCollabSocket = function(roomhash, cb) {
    
    // still check here
    if (Auth.isAuth() /* && !$rootScope.battleSocket */) {
      // now time to set up the battle socket
      $rootScope.collabSocket = Socket.createSocket('collab', [
        'username=' + Users.getAuthUser(),
        'handler=collab',
        'roomhash=' + roomhash
      ]);

      $rootScope.collabSocket.on('connect', function() {
        $rootScope.initCollabSocketEvents(cb);
      });
    }
  };

  // initialise dash socket events
  $rootScope.initCollabSocketEvents = function(cb) {
    // console.log('init the collab events');
    // state change and socket handling
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      if (next.name !== 'collabroom') {
        $rootScope.collabSocket.emit('disconnectedClient', {username: Users.getAuthUser()});
        $rootScope.collabSocket.disconnect();
      }
    });

    // refresh handler
    window.onbeforeunload = function(e) {
      $rootScope.collabSocket.emit('disconnectedClient', {username: Users.getAuthUser()});
      $rootScope.collabSocket.disconnect();
    };

    // listen for socket disconnection
    $rootScope.collabSocket.on('disconnect', function() {
      // console.log('collab socket disconnected');
    });

    // run the callback
    cb();
  };


  ////////////////////////////////////////////////////////////
  // handle auth stuffs
  ////////////////////////////////////////////////////////////

  $rootScope.$on('$stateChangeStart', function (evt, next, current) {
    // redirect home if auth required and user isn't auth
    if (next && next.authenticate && !Auth.isAuth()) {
      $location.path('/');
    }

    // redirect to dashboard if user is auth and tries to access home page
    if (next && next.url === '/' && Auth.isAuth()) {
      $location.path('/dashboard');
    }
  });
});

// something
