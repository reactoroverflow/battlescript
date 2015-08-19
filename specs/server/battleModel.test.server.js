'use strict';

var expect = require('expect.js');
var path = require('path');

var Battle = require(path.resolve('./server/battles/battleModel.js'));

describe('Battle Models', function () {

  var battle = {};
  var _battle = new Battle(battle);

  it('should begin with no battles', function (done) {
    Battle.find({}, function (err, battles) {
      expect(battles.length).to.equal(0);
      done();
    });
  });

  it('should be able to save without a problem', function (done) {
    _battle = new Battle(battle);
    _battle.save(function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  describe('check the fields', function () {
    var Battles;

    before(function (done) {
      Battle.find({}, function (err, battles) {
        Battles = battles;
        battle = Battles[0];
        done();
      });
    });

    it('should have one battle saved', function () {
      expect(Battles.length).to.equal(1);
    });

    it('roomhash should be a string', function () {
      expect(battle.roomhash).to.be.a('string');
    });

    it('challenge name should be a string', function () {
      expect(battle.challengeName).to.be.a('string');
    });

    it('challenge level should be a number', function () {
      expect(battle.challengeLevel).to.be.a('number');
    });

    it('challenge level should be greater than 0', function () {
      expect((battle.challengeLevel) > 0).to.equal(true);
    });

    it('challenge Level should be less than 9', function () {
      expect((battle.challengeLevel) < 9).to.equal(true);
    });

    it('challenge level should be a whold number', function () {
      expect(battle.challengeLevel % 1).to.equal(0);
    });

  });
    
});
