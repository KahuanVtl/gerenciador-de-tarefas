const app = require('../config/express')();

module.exports = (req, res) => {
  app.handle(req, res);
};
