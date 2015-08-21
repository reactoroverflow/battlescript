var collabingController = require('./collabingController.js');

module.exports = function (app) {
  app.post('/getcollab', collabingController.getCollab);
  app.post('/attemptcollab', collabingController.attemptCollab);
};
