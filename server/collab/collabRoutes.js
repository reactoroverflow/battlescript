var collabController = require('./collabController.js');

module.exports = function (app) {
  app.post('/checkvalidcollabroom', collabController.checkvalidcollabroom);
};
