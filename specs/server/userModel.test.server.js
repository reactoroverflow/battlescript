'use strict';

var expect = require('expect.js');
var path = require('path');

var User = require(path.resolve('./server/users/userModel.js'));

describe('User Model', function () {

  var user;
  var _user;

  beforeEach(function (done) {
    user = {
      username: 'test',
      password: 'passWoRd!'
    };
    done();
  });

  afterEach(function (done) {
    User.remove().exec(done);
  });
  
  it('should begin with no users', function (done) {
    User.find({}, function (err, users) {
      expect(users.length).to.equal(0);
      done();
    });
  });

  it('should be able to save without a problem', function (done) {
    _user = new User(user);
    _user.save(function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it('should throw an error if saving without a username', function (done) {
    delete user.username;
    _user = new User(user);
    _user.save(function (err) {
      expect(err).to.not.equal(null);
      done();
    });
  });

  it('should throw an error if saving without a password', function (done) {
    delete user.password;
    _user = new User(user);
    _user.save(function (err) {
      expect(err).to.not.equal(null);
      done();
    });
  });

  it('should set the username to all lowercase', function (done) {
    user.username = "UPPerCasE";
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: 'uppercase'}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].username).to.equal('uppercase');
        done();
      });
    });
  });

  it('should set default current streak if none set', function (done) {
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].currentStreak).to.equal(0);
        done();
      });
    });
  });

  it('should set default longest streak if none set', function (done) {
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].longestStreak).to.equal(0);
        done();
      });
    });
  });

  it('should set default total wins if none set', function (done) {
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].totalWins).to.equal(0);
        done();
      });
    });
  });

  xit('should set default total points if none set', function (done) {
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].totalPoints).to.equal(0);
        done();
      });
    });
  });

  it('should set the current streak if passed in', function (done) {
    user.currentStreak = 5;
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].currentStreak).to.equal(5);
        done();
      });
    });
  });

  it('should set the longest streak if set', function (done) {
    user.longestStreak = 5;
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].longestStreak).to.equal(5);
        done();
      });
    });
  });

  it('should set the total wins if set', function (done) {
    user.totalWins = 5;
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].totalWins).to.equal(5);
        done();
      });
    });
  });

  xit('should set the total wins if set', function (done) {
    user.totalPoints = 5;
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].totalPoints).to.equal(5);
        done();
      });
    });
  });

  it('should be able to save multiple users', function (done) {
    _user = new User(user);
    var _user2 = new User({username: 'test2', password: 'someNewPassword'});
    _user.save(function (err) {
      expect(err).to.equal(null);
      _user2.save(function (err) {
        expect(err).to.equal(null);
        done();
      });
    });
  });

  it('should not be able to save another user with the save username', function (done) {
    _user = new User(user);
    var _user2 = new User(user);
    _user.save(function (err) {
      expect(err).to.equal(null);
      _user2.save(function (err) {
        expect(err).to.not.equal(null);
        done();
      });
    });
  });

  it('should not be able to save another user with the save username lowercase', function (done) {
    user.username = "newUserName";
    _user = new User(user);
    user.username = "newusername";
    var _user2 = new User(user);
    _user.save(function (err) {
      expect(err).to.equal(null);
      _user2.save(function (err) {
        expect(err).to.not.equal(null);
        done();
      });
    });
  });

  xit('should have an empty avatar if none specified', function (done) {
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].avatar).to.equal('');
        done();
      });
    });
  });

  xit('should save an avatar if specified', function (done) {
    user.avatar = 'img/avatar.jpg';
    _user = new User(user);
    _user.save(function (err) {
      User.find({username: user.username}, function (err, users) {
        expect(err).to.equal(null);
        expect(users.length).to.equal(1);
        expect(users[0].avatar).to.equal('img/avatar.jpg');
        done();
      });
    });
  });

});
