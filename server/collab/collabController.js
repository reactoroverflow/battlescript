var Collab = require('./collabModel.js'),
    Q    = require('q');

module.exports = {

  // use on the server only
  addCollabRoom: function (challengeLevel, cb) {
    console.log("ADDING COLLAB ROOM, CHALLENGE LEVEL: ", challengeLevel);
    Collab.create({challengeLevel: challengeLevel}, function(err, collabRoom) {
      if (err) console.log(err);

      cb(collabRoom.roomhash);
    });
  },

  checkvalidcollabroom: function(req, res, err) {
    Collab.findOne({roomhash: req.body.hash}, function(err, room) {
      room === null ? res.send(false) : res.send(true);
    });
  }
};
