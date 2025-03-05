const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign  = require('consign');

// LOGGER
const morgan = require("morgan");
const logger = require("./logger");
const rateLimiter = require('./rateLimiter');


module.exports = () => {
    const app = express();

    // SETANDO VARIÁVEIS DA APP
    app.set('port', config.get('server.port'));

    // MIDDLEWAREs
    app.use(bodyParser.json());
    app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));
    app.use(rateLimiter);

    // ENDPOINTS
    consign({cwd: 'api'})
        // .include('data') COMENTADO POIS NÃO USA MAIS! -> Direto no banco
        .include('controllers')
        .include('routes')     
        .into(app);

    return app;
};
