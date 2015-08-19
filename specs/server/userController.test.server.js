'use strict';

var expect = require('expect.js');
var path = require('path');
var request = require('supertest');

var userController = require(path.resolve('./server/users/userController.js'));
var User = require(path.resolve('./server/users/userModel.js'));

describe('Users Controller', function () {

  before(function (done) {
    //app = require(path.resolve('./server/server.js'));
    //agent = request.agent(app);
    done();
  });
  
  describe('signin', function () {
    
    it('should have a signin controller', function () {
      expect(userController.signin).to.be.a('function');
    });

  });

  describe('signup', function () {
    
    it('should have a signup controlelr', function () {
      expect(userController.signup).to.be.a('function');
    });

  });
  
  describe('checkAuth', function () {

    it('should have a checkAuth controller', function () {
      expect(userController.checkAuth).to.be.a('function');
    });

  });

  describe('signout', function () {
    
    it('should have a signout controller', function () {
      expect(userController.signout).to.be.a('function');
    });

  });

  describe('stats', function () {

    it('should have a stats controller', function () {
      expect(userController.stats).to.be.a('function');
    });

  });

  describe('statChange', function () {

    it('should have a statChange controller', function () {
      expect(userController.statChange).to.be.a('function');
    });

  });

  describe('leaderboard', function () {

    it('should have a leaderboard controller', function () {
      expect(userController.leaderboard).to.be.a('function');
    });

  });

});
