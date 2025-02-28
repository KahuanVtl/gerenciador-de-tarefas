const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    user: "gerenciador_tarefas",
    host: "localhost",
    database: "gerenciador_tarefas",
    password: process.env.PS_PASSWORD,
    port: 5432
});

module.exports = pool;