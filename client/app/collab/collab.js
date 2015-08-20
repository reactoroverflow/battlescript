angular.module('battlescript.collab', [])

.controller('CollabController', function($rootScope, $scope, $timeout, $location, $stateParams, Users, Collab, Battle, Editor) {
  $scope.username = Users.getAuthUser();

  // $scope.toDisplayCursor = 'none';    

  // $scope.setCursorPlace = function(partnerCursorCoords) {
  //   // $scope.$apply(function() {    
  //   //   $scope.setCursorCoordsTop = partnerCursorCoords.cursorCoords.top - 10 + 'px';
  //   //   $scope.setCursorCoordsLeft = partnerCursorCoords.cursorCoords.left - 2 + 'px';
  //   //   $scope.toDisplayCursor = 'block';    
  //   // });
  //   // $scope.userEditor.replaceRange('', partnerCursorCoords.cursorPosition);
  // }
  
  $scope.sendUserTextChangeSocketSignal = function() {
    $scope.userEditorProperties = {
      // cursorCoords: $scope.userEditor.cursorCoords(), 
      editorValue: $scope.userEditor.getValue(), 
      cursorPosition: $scope.userEditor.getCursor()
    };
    $rootScope.collabSocket.emit('userTextChange', $scope.userEditorProperties);
  };

  ////////////////////////////////////////////////////////////
  // jQuery function
  ////////////////////////////////////////////////////////////
  jQuery(function($){
    $('body').keydown(function() {
      setTimeout(function() {
        $scope.sendUserTextChangeSocketSignal();
        $scope.thisUserCursorPosition = $scope.userEditor.getCursor();
        // console.log($scope.thisUserCursorPosition);
      }, 1);
    });

    $('body').click(function() {
      setTimeout(function() {
        $scope.thisUserCursorPosition = $scope.userEditor.getCursor();
        // console.log($scope.thisUserCursorPosition);
        // $scope.sendUserTextChangeSocketSignal();
      }, 1);
    }); 

    $("#blurify__button").hover(function() {
      if($scope.totalPoints < 10) {
        $("#blurify__button").css('cursor','none');
      }
    });

    $("#jumblify__button").hover(function() {
      if($scope.totalPoints < 50) {
        $("#jumblify__button").css('cursor','none');
      }
    }); 

    $("#blurify__button").click(function() {
      if($scope.totalPoints>=10) {
        $scope.handleBlurifyEvents();
        Users.pointsChange($scope.user, -10); //blurify costs 10 points
        $scope.getStats($scope.username);
        return;
      } 
    });

    $("#jumblify__button").click(function() {
      if($scope.totalPoints>=50) {
        $scope.handleJumblifyEvents();
        Users.pointsChange($scope.user, -50); //blurify costs 10 points
        $scope.getStats($scope.username);
        return;
      } 
    });

    // FOR TESTING AND DEMO (maybe for deployed also)
    var secretCode = '';

    $("#swordnumber1").click(function() {
      secretCode+="one";
    });

    $("#swordnumber2").click(function() {
      secretCode+='two';
      if(secretCode === "onetwoonetwotwo") {
        Users.pointsChange($scope.user, 100);
        $scope.getStats($scope.username);        
      }
    });

  });





  ////////////////////////////////////////////////////////////
  // Displays insufficient point error message
  ////////////////////////////////////////////////////////////
  // $scope.displayPointsErrorMessage = function() {
  //   console.log('displayPointsErrorMessage executed');
  //   $rootScope.pointsErrorMessage = 'Not enough points!';    
  // }

  ////////////////////////////////////////////////////////////
  // fetch auth user and pass in info to directive
  ////////////////////////////////////////////////////////////

  $scope.user = Users.getAuthUser();
  $scope.userInfo = {username: $scope.user};

  ////////////////////////////////////////////////////////////
  // get user stats for dashboard
  ////////////////////////////////////////////////////////////

  $scope.getStats = function(username) {
    Users.getStats(username)
      .then(function(stats){
        $scope.currentStreak = stats.currentStreak;
        $scope.longestStreak = stats.longestStreak;
        $scope.totalWins = stats.totalWins;
        $scope.totalPoints = stats.totalPoints;
      });
  };

  $scope.getStats($scope.username);





  ////////////////////////////////////////////////////////////
  // set up spinner class and display it by default
  ////////////////////////////////////////////////////////////

  $scope.spinnerOn = true;

  ////////////////////////////////////////////////////////////
  // check first to see if valid collab room id
  ////////////////////////////////////////////////////////////

  $scope.collabRoomId = $stateParams.id;
  $scope.collabInitialized = false;

  Collab.isValidCollabRoom($scope.collabRoomId)
  .then(function(valid) {
    if (valid) {
      // if we have a valid collab room, then do this
      $rootScope.initCollabSocket($scope.collabRoomId, function() {
        // initialize collab socket events
        $scope.initCollab();
      });
    } else {
      // redirect to dashboard if collab id not valid
      $location.path('/dashboard');
    }
  })
  .catch(function(err) {
    console.log(err);
  });





  ////////////////////////////////////////////////////////////
  // set up user and opponent defaults
  ////////////////////////////////////////////////////////////

  // set up user states
  $scope.userReadyState = false;
  $scope.userReadyClass = '';
  $scope.userReadyText = 'Waiting on you';

  // set up opponent states
  $scope.opponentReadyState = false;
  $scope.opponentReadyClass = '';
  $scope.opponentReadyText = 'Waiting on partner';





  ////////////////////////////////////////////////////////////
  // initialize the collab
  // 
  // this, importantly, needs to be set up here after the
  // collab socket itself has been initialized and set up
  // above.
  // 
  // unlike the updateUserReadyState function, this works
  // in tandem with the sockets. Hence, it needs to wait for
  // the socket to be initialized in the first place.
  ////////////////////////////////////////////////////////////

  $scope.initCollab = function() {
    // calls the function immediately, in case of refresh
    $scope.ifBothPlayersReady();

    // now listen for events
    $rootScope.collabSocket.on('opponentReady', function(opponent) {
      if ($scope.opponentReadyState === false) {
        $scope.opponentReadyState = true;
        $scope.opponentReadyClass = 'active';
        $scope.opponentReadyText = 'Ready to collaborate!';
        $scope.opponent = opponent;
        $scope.ifBothPlayersReady();
      } else {
        $scope.opponent = opponent;
      }
    });

    $rootScope.collabSocket.on('nameReq', function(){
      $rootScope.collabSocket.emit('nameSend', $scope.user);
    });
  };





  ////////////////////////////////////////////////////////////
  // this updates the user's ready state depending on whether
  // they clicks the button
  ////////////////////////////////////////////////////////////

  $scope.updateUserReadyState = function() {
    if ($scope.userReadyState === false) {
      $scope.userReadyState = true;
      $scope.userReadyClass = 'active';
      $scope.userReadyText = 'Ready for collab!';
      $rootScope.collabSocket.emit('userReady', $scope.user);
      $scope.ifBothPlayersReady();
    }
  };




  ////////////////////////////////////////////////////////////
  // checks if both players ready
  // 
  // this gets called each time a user clicks a "ready state"
  // button.
  ////////////////////////////////////////////////////////////
  
  $scope.ifBothPlayersReady = function() {
    if ($scope.userReadyState && $scope.opponentReadyState || window.localStorage.getItem('collabInitiated-' + $scope.collabRoomId)) {

      // If collab has already been initiated, set user and opponent ready state to true
      // so that waiting screen will not show
      if (window.localStorage.getItem('collabInitiated-' + $scope.collabRoomId)){
        $scope.userReadyState = true;
        $scope.opponentReadyState = true;
        $rootScope.collabSocket.emit('getOpponent');
      } else {
        // Save collab initiated to local storage: this will allow collab to reload automatically
        // if user refreshes page, or comes back to collab after leaving accidentally
        window.localStorage.setItem('collabInitiated-' + $scope.collabRoomId, true);
      }
      
      $scope.setUpCollab();
    } else {
      // show the collab waiting area
      $scope.spinnerOn = false;
      $scope.showCollabWaitingArea = true;
      if (!$scope.$$phase) $scope.$apply();
    }
  };
  




  ////////////////////////////////////////////////////////////
  // set up the collab here
  ////////////////////////////////////////////////////////////

  $scope.setUpCollab = function() {
    $scope.spinnerOn = true;
    if (!$scope.$$phase) $scope.$apply();
    
    // set up both editors
    $scope.userEditor = Editor.makeEditor('#editor--user', false);
    // $scope.opponentEditor = Editor.makeEditor('#editor--opponent', true);
    $scope.handleEditorEvents();

    // set up various fields
    $scope.userButtonAttempt = 'Attempt Solution';
    $scope.userNotes = 'Nothing to show yet...';

    // get the collab
    $scope.getCollab();
  };

  ////////////////////////////////////////////////////////////
  // handle power(jumblify) events
  ////////////////////////////////////////////////////////////
  $scope.handleJumblifyEvents = function() {
    $rootScope.collabSocket.emit('powerJumblifySent');      
  }

  $scope.handleJumblifyReceiveEvents = function() {

    $rootScope.collabSocket.on('powerJumblifyReceived', function() {
      var currentTextareaValue = $scope.userEditor.getValue();
      var length = currentTextareaValue.length;
      var index1 = length / 3;
      var index2 = length / 3 * 2;
      var textChunk1 = currentTextareaValue.slice(0,index1);
      var textChunk2 = currentTextareaValue.slice(index1,index2);
      var textChunk3 = currentTextareaValue.slice(index2,length);

      var generateRandomNumber = Math.random();
      if(generateRandomNumber < 0.33) {
        $scope.userEditor.setValue(textChunk1 + _.shuffle(textChunk2.split('')).join('') + textChunk3);
      } else if (generateRandomNumber < 0.66) {
        $scope.userEditor.setValue(textChunk1 + textChunk2 + _.shuffle(textChunk3.split('')).join(''));            
      } else {
        $scope.userEditor.setValue(_.shuffle(textChunk1.split('')).join('') + textChunk2 + textChunk3);            
      }
    });
  };





  ////////////////////////////////////////////////////////////
  // handle power(blurify) events
  ////////////////////////////////////////////////////////////
  $scope.handleBlurifyEvents = function() {
    $rootScope.collabSocket.emit('powerBlurifySent');      
  };

  $scope.handleBlurifyReceiveEvents = function() {
    $rootScope.collabSocket.on('powerBlurifyReceived', function() {
        jQuery(function($){
          $('.blurify__overlay').css('display','inline');
          $('.blurify__overlay').css("opacity","0.85");
          $('.blurify__overlay').fadeIn( 2000 ).delay( 5000 ).slideUp( 400 );
        });
    });
  };





  ////////////////////////////////////////////////////////////
  // handle editor events
  ////////////////////////////////////////////////////////////

  $scope.handleEditorEvents = function() {
    // $scope.userEditor.on('change', function(e) {
    // });

    $rootScope.collabSocket.on('updateOpponent', function(text){
      // console.log('user cursor position after updating opponent',$scope.thisUserCursorPosition);
      $scope.userEditor.setValue(text.editorValue);
      $scope.userEditor.setCursor($scope.thisUserCursorPosition);
      // $scope.setCursorPlace(text);
    });
  };


  ////////////////////////////////////////////////////////////
  // get the collab, get ready for showdown!
  ////////////////////////////////////////////////////////////
  
  $scope.getCollab = function() {
    // first, cache some vars
    $scope.collab;
    $scope.collabDescription = null;
    $scope.collabProjectId = null;
    $scope.collabSolutionId = null;

    // fetch a collab
    Collab.getCollab($scope.collabRoomId)
    .then(function(data) {
      // display the collab field
      $scope.displayCollabField();

      // set up the collab specifics
      $scope.collab = JSON.parse(data.body);
      $scope.collabDescription = marked($scope.collab.description);
      $scope.collabProjectId = $scope.collab.session.projectId;
      $scope.collabSolutionId = $scope.collab.session.solutionId;

      // update editors
      $timeout(function() {
        $scope.userEditor.setValue($scope.collab.session.setup);
        // $scope.opponentEditor.setValue($scope.collab.session.setup);
        $scope.$apply();
      }, 50);

    })
    .catch(function(err) {
      console.log('There was an error fetching the problem...');
      console.log(err);
    });
  };


  ////////////////////////////////////////////////////////////
  // display the collab field
  ////////////////////////////////////////////////////////////

  $scope.displayCollabField = function() {
    // hide the spinner, hide the waiting area, and show the collab field
    $scope.spinnerOn = false;
    $scope.showCollabWaitingArea = false;
    $scope.collabFieldClass = 'active';

    // handle collab field events
    $scope.handleCollabFieldEvents();
    $scope.handleBlurifyReceiveEvents();
    $scope.handleJumblifyReceiveEvents();
    $scope.partnerClickedCollab();
    $scope.partnerReceivedCollabMessage();
    $scope.endCollabSession();
  };


  ////////////////////////////////////////////////////////////
  // handle collab events
  ////////////////////////////////////////////////////////////
  $scope.partnerClickedCollab = function() {
    $rootScope.collabSocket.on('partnerClickedAttempting', function(){
      jQuery(function($){
        $('.partnerClickedAttemptNotice').fadeIn( 1000 );
      });
      $scope.$apply(function() {
        $scope.userButtonAttempt = 'Partner clicked Attempt Solution...';        
      });
    });
  };

  $scope.partnerReceivedCollabMessage = function() {
    $rootScope.collabSocket.on('sendPartnerAttemptMessage', function(data){
      jQuery(function($){
        $('.partnerClickedAttemptNotice').fadeOut( 1000 );
      });
      $scope.$apply(function() {
        $scope.userNotes = data;
        $scope.userButtonAttempt = 'Attempt Solution';
      });
    });
  };

  $scope.endCollabSession = function() {
    $rootScope.collabSocket.on('endCollabSession', function(){
      $scope.$apply(function() {
        $scope.userNotes = "All tests passing!";        
      });
      alert('You have the answer. Good job!');
      console.log('directing back to dashboard, in endCollabSession');
      $scope.$apply( function() {
        $location.path('/dashboard'); //redirect back. winner found
      });
    });
  };


  ////////////////////////////////////////////////////////////
  // handle collab events
  ////////////////////////////////////////////////////////////

  $scope.handleCollabFieldEvents = function() {
    $rootScope.collabSocket.on('opponentWon', function(){
      // Any negative is regarded as a loss. 
      // Users.statChange($scope.user, -1);
      // Users.pointsChange($scope.user, 1); //users get one point for every game they play but lost

      // alert to the user!
      // alert('Looks like your opponent got the answer first!');

      //redirect back. winner found
      $location.path('/dashboard'); 
    });
  };
  

  ////////////////////////////////////////////////////////////
  // handle collab attempts
  ////////////////////////////////////////////////////////////

  $scope.attemptCollab = function($event) {
    $event.preventDefault();

    $scope.userButtonAttempt = 'Attempting...';
    $rootScope.collabSocket.emit('clickedAttempting');

    Collab.attemptCollab($scope.collabProjectId, $scope.collabSolutionId, $scope.userEditor.getValue())
      .then(function(data) {
        $scope.userButtonAttempt = 'Attempt Solution';
        $scope.userNotes = data.reason;
        $rootScope.collabSocket.emit('userReceivedAttemptMessage', data.reason);

        // TODO: polling is successful at this point in time, time to send
        // and recieve the correct data
        console.log(data);
        if (data['passed'] === true) {
          $rootScope.collabSocket.emit('solutionFound');
          $scope.userNotes = "All tests passing!";
          alert('You have the answer. Good job!');
          console.log('directing back to dashboard, in attemptCollab');
          $location.path('/dashboard'); //redirect back. winner found
        }
      });
  };

});
