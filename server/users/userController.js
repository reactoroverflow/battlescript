var User = require('./userModel.js'),
    Q    = require('q'),
    jwt  = require('jwt-simple'),
    _    = require('underscore');

module.exports = {
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});

                //Set the user to be online
                user.save();

              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          next(new Error('User already exists!'));
        } else {
          // make a new user if not one
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        
        user.save();

        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  },

  signout: function (req, res, next){
      // console.log("this is req.body",req.body);
      var username = req.body.username;
      var findUser = Q.nbind(User.findOne, User);
      
      findUser({username: username})
        .then(function (user) {

          user.save();
        });
  },

  stats: function(req, res, next){

    var username = req.query.username;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        // console.log(user);
        res.send({
          totalWins: user.totalWins,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          totalPoints: user.totalPoints,
          avatar: user.avatar
        });
      });
    
  }, 

  statChange: function(req, res, next) {
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: req.body.username})
      .then(function (user) {
        if (req.body.winIncrease > 0) {
          user.winIncrease += req.body.winIncrease;
          user.currentStreak += req.body.winIncrease;
          user.totalWins += req.body.winIncrease;

          if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
          }

        } else {
          user.currentStreak = 0;
        }
        user.save();
      });
  },

  avatarChange: function(req, res, next) {
    // console.log("req.body ==== ", req.body);
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: req.body.username})
      .then(function (user) {
        user.avatar = req.body.avatar;
        // console.log("user === ", user);
        user.save();
        res.send({
          avatar: user.avatar
        });
      });
  },

  setFbId: function(req, res, next) {
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: req.body.username})
      .then(function (user) {
        user.fbId = req.body.fbId;
        user.save();
        res.send({
          username: user.username
        });
      });
  },

  getUsernameFromFbId: function(req, res, next){

    var fbId = req.query.fbId;
    // console.log("req.query", req.query)

    var findUser = Q.nbind(User.findOne, User);
    findUser({fbId: fbId})
      .then(function (user) {
        // console.log(user);
        res.send({
          username: user.username
        });
      });
  }, 

  setFriend: function(req, res, next) {
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: req.body.username})
      .then(function (user) {
        // console.log("in server trying to put friend into friends array")
        if(!_.contains(user.friends, req.body.friendusername)){
          // console.log("hello world ============ ")
          user.friends.push(req.body.friendusername);
          user.save();
        }
        res.send({
          friends: user.friends
        });
      });
  },

  getFriendsList: function(req, res, next) {
    // console.log('inside getFriendsList');
    var username = req.query.username;
    // console.log("username ===== ", username)

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        // console.log(user);
        res.send({
          friends: user.friends,
        });
      });
  },
  
  pointsChange: function(req, res, next) {
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: req.body.username})
      .then(function (user) {
        user.totalPoints += req.body.pointIncrease;          
        user.save();
      })
      res.end();
  },

  leaderboard: function(req, res, next){

    User.find()
      .select('-_id -salt -password')
      .sort({totalWins: -1})
      .limit(5) // Get every user. Exclude password, id, salt.
      .then(function(users){
        // console.log("USERS: ", users);
        res.send(users);
      })

  }
};
