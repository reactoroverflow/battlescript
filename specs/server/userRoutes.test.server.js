'use strict';

var expect = require('expect.js');
var path = require('path');

var userController = require(path.resolve('./server/users/userController.js'));
var userRoutes = require(path.resolve('./server/users/userRoutes.js'));

describe('User Routes', function () {

  var app;
  var routes;

  app = {};
  routes = {};
  app.get = function(route, controller) {
    routes[route] = controller;
  };
  app.post = function(route, controller) {
    routes[route] = controller;
  };
  userRoutes(app);

  for(var key in routes) {
    
    it('should pass a string as the route', function () {
      expect(key).to.be.a('string');
    });

    it('should pass a function as the controller', function () {
      expect(routes[key]).to.be.a('function');
    });

  }

  it('should pass /signin as a route', function () {
    expect(routes['/signin']).to.be.ok();
  });

  it('/signin should call signin', function () {
    expect(routes['/signin']).to.equal(userController.signin);
  });

  it('should pass /signup as a route', function () {
    expect(routes['/signup']).to.be.ok();
  });

  it('/signup should call signup', function () {
    expect(routes['/signup']).to.equal(userController.signup);
  });

  it('should pass /signedin as a route', function () {
    expect(routes['/signedin']).to.be.ok();
  });

  it('/signedin should call checkAuth', function () {
    expect(routes['/signedin']).to.equal(userController.checkAuth);
  });

  it('should pass /signout as a route', function () {
    expect(routes['/signout']).to.be.ok();
  });

  it('/signout should call signout', function () {
    expect(routes['/signout']).to.equal(userController.signout);
  });

  it('should pass /stats as a route', function () {
    expect(routes['/stats']).to.be.ok();
  });

  it('/stats should call stats', function () {
    expect(routes['/stats']).to.equal(userController.stats);
  });

  it('should pass /statchange as a route', function () {
    expect(routes['/statchange']).to.be.ok();
  });

  it('/statchange should call statChange', function () {
    expect(routes['/statchange']).to.equal(userController.statChange);
  });

  it('should pass /leaderboard as a route', function () {
    expect(routes['/leaderboard']).to.be.ok();
  });

  it('/leaderboard should call leaderboard', function () {
    expect(routes['/leaderboard']).to.equal(userController.leaderboard);
  });

});
