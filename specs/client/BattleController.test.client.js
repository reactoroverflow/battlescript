'use strict';

describe('BattleController', function () {

  var $rootScope, $location, $window, $httpBackend, $timeout, $stateParams, $scope, Users, Editor, Battle, $controller, createController;

  beforeEach(module('battlescript'));

  beforeEach(inject(function ($injector){
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    $timeout = $injector.get('$timeout');
    $stateParams = $injector.get('$stateParams');
    $scope = $rootScope.$new();
    Users = $injector.get('Users');
    Editor = $injector.get('Editor');
    Battle = $injector.get('Battle');

    $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('BattleController', {
        $rootScope: $rootScope,
        $scope: $scope,
        $timeout: $timeout,
        $stateParams: $stateParams,
        $window: $window,
        $location: $location,
        Users: Users,
        Editor: Editor,
        Battle: Battle
      });
    };

    createController();
  }));

  it('should have a user', function () {
    expect($scope.user).to.be.ok();
  });

  it('should have userInfo', function () {
    expect($scope.userInfo).to.be.an('object');
  });

  it('should have $scope.user inside userInfo', function () {
    expect($scope.userInfo.username).to.equal($scope.user);
  });

  xit('should have a getStats function', function () {
    expect($scope.getState).to.be.a('function');
  });

});
