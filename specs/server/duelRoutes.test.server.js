'use strict';

var expect = require('expect.js');
var path = require('path');

var duelController = require(path.resolve('./server/duels/duelController.js'));
var duelRoutes = require(path.resolve('./server/duels/duelRoutes.js'));

describe('Duels Routes', function () {

  var app;
  var routes;

  app = {};
  routes = {};
  app.post = function(route, controller) {
    routes[route] = controller;
  };
  duelRoutes(app);

  for(var key in routes) {
    
    it('should pass a string as the route', function () {
      expect(key).to.be.a('string');
    });

    it('should pass a function as the controller', function () {
      expect(routes[key]).to.be.a('function');
    });

  }

  it('should pass /getduel as a route', function() {
    expect(routes['/getduel']).to.be.ok();
  });

  it('should pass /attemptduel as a route', function() {
    expect(routes['/attemptduel']).to.be.ok();
  });

  it('/getduel should call getDuel', function () {
    expect(routes['/getduel']).to.equal(duelController.getDuel);
  });

  it('/sttemptduel should call attemptDuel', function () {
    expect(routes['/attemptduel']).to.equal(duelController.attemptDuel);
  });

});
