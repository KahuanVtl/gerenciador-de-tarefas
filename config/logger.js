const winston = require("winston");
const path = require("path");
const fs = require("fs");

// Criar diretório de logs caso não exista
const logsDir = path.join(__dirname, "../api/data/logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(logsDir, "combined.log") }),
    ],
});

// Se estiver rodando em ambiente de desenvolvimento, mostra logs no console
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

module.exports = logger;
