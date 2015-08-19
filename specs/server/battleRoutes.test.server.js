'use strict';

var expect = require('expect.js');
var path = require('path');

var battleController = require(path.resolve('./server/battles/battleController.js'));
var battleRoutes = require(path.resolve('./server/battles/battleRoutes.js'));

describe('Battle Routes', function () {

  var app;

  beforeEach(function () {
    app = {};
  });

  it('should pass a string as the route', function () {
    app.post = function(route, controller) {
      expect(route).to.be.a('string');
    };
    battleRoutes(app);
  });

  it('should have a checkvalidbattleroom route', function () {
    app.post = function(route, controller) {
      expect(route).to.equal('/checkvalidbattleroom');
    };
    battleRoutes(app);
  });

  it('should pass a function as the controller', function () {
    app.post = function(route, controller) {
      expect(controller).to.be.a('function');
    };
    battleRoutes(app);
  });

  it('should pass the checkvalidbattleroom controller', function () {
    app.post = function(route, controller) {
      expect(controller).to.equal(battleController.checkvalidbattleroom);
    };
    battleRoutes(app);
  });

});
