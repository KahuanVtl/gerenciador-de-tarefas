// express.js
const express = require('express');
const bodyParser = require('body-parser');
const consign  = require('consign');
const morgan = require("morgan");
const logger = require("./logger");
const rateLimiter = require('./rateLimiter');

module.exports = () => {
    const app = express();

    // SETANDO VARIÁVEIS DA APP
    const port = process.env.PORT || 3000; // <= TROCA AQUI
    app.set('port', port);

    // MIDDLEWAREs
    app.use(bodyParser.json());
    app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));
    app.use(rateLimiter);

    // ENDPOINTS
    consign({cwd: 'api'})
        .include('controllers')
        .include('routes')     
        .into(app);

    return app;
};
