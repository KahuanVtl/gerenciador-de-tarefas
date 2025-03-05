const rateLimit = require("express-rate-limit");

// Limitador de requisições: 100 requisições por 5 minutos
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100, 
    message: { error: "Muitas requisições, tente novamente mais tarde." },
    headers: true,
});

module.exports = limiter;
