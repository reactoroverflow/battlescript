var userController = require('./userController.js');


module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth);
  app.post('/signout', userController.signout);
  app.get('/stats', userController.stats);
  app.get('/getfriend', userController.getUsernameFromFbId);
  app.get('/getfriends', userController.getFriendsList);
  app.post('/setfriend', userController.setFriend);
  app.post('/statchange', userController.statChange);
  app.post('/avatarchange', userController.avatarChange);
  app.get('/leaderboard', userController.leaderboard);
  app.post('/pointschange', userController.pointsChange);
  app.post('/setfbid', userController.setFbId);



};
