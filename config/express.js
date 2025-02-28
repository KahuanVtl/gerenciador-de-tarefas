const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign  = require('consign');

module.exports = () => {
    const app = express();

    // SETANDO VARIÁVEIS DA APP
    app.set('port', config.get('server.port'));

    // MIDDLEWARE
    app.use(bodyParser.json());

    require('../api/routes/customerWallets')(app);

    return app;
};