'use strict';

describe('Auth Controller', function () {
  var $rootScope, $location, $window, $httpBackend, $scope, Auth, $controller, createController;
  
  beforeEach(module('battlescript'));

  beforeEach(inject(function ($injector){
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();
    Auth = $injector.get('Auth');

    $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('AuthController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Auth: Auth
      });
    };

    createController();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('battlepro');
  });

  it('should have an signin method', function () {
    expect($scope.signin).to.be.ok();
  });

  it('should store token in localStorage after signin', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';
    $httpBackend.expectPOST('/api/users/signin').respond({token: token});
    $scope.signin();
    $httpBackend.flush();
    expect($window.localStorage.getItem('battlepro')).to.be(token);
  });

  it('should have a sgnup method', function () {
    expect($scope.signup).to.be.ok();
  });

  it('should store token in localStorage after signup', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';

    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST('/api/users/signup').respond({token: token});
    $scope.signup();
    $httpBackend.flush();
    expect($window.localStorage.getItem('battlepro')).to.be(token);
  });

  it('should have a logout method', function () {
    expect($scope.logout).to.be.ok();
  });

  it('should remove the token from localstorage', function () {
    var token = 'sjj232hwjhr3urw90rof';

    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST('/api/users/signout').respond({token: token});
    $scope.logout();
    $httpBackend.flush();
    expect($window.localStorage.getItem('battlepro')).to.equal(null);
  });

  it('should have a user object', function () {
    expect($scope.user).to.be.a('object');
  });

});
