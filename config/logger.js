const winston = require("winston");
const path = require("path");
const fs = require("fs");

const isProduction = process.env.NODE_ENV === "production";

const transports = [
    // Sempre loga no console
    new winston.transports.Console({
        format: isProduction ? winston.format.json() : winston.format.simple(),
    })
];

// Se NÃO for produção, também loga em arquivos
if (!isProduction) {
    const logsDir = path.join(__dirname, "../api/data/logs");

    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    transports.push(
        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
        }),
        new winston.transports.File({
            filename: path.join(logsDir, "combined.log"),
        })
    );
}

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports
});

module.exports = logger;
