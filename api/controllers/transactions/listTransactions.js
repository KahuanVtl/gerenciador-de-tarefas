module.exports = app => {
    const logger = require('../../../config/logger');
    const queries = require('./utils/queries');
    const keys = require('../../utils/queries');
    const controller = {};

    controller.listTransactions = async (req, res) => {
        try {
            const Authorization = req.headers.authorization;
            let { page = 1, limit = 10 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            if (isNaN(page) || isNaN(limit)) {
                return res.status(400).json({ message: "Fail", motive: "Page or Limit should be a number" });
            }

            const offset = (page - 1) * limit;

            logger.info(`Fetching Transactions`);

            // Buscar o usuário pelo token de autorização
            const userKey = await keys.getUserKey(Authorization);

            if (!Authorization || !userKey?.typeuser) {
                return res.status(401).json({ message: "Authorization key is required." });
            }

            let transactionsDB;
            if (userKey.typeuser === 'user') {
                transactionsDB = await queries.getUserTransactions(limit, offset);
            } else if (userKey.typeuser === 'admin') {
                transactionsDB = await queries.getAdminTransactions(limit, offset);
            }

            logger.info(`Transactions found: ${JSON.stringify(transactionsDB)}`);
            return res.status(200).json({ message: "Success", data: transactionsDB });

        } catch (error) {
            logger.error(`Error fetching Transactions: ${error.message}`);
            return res.status(500).json({ message: 'Error fetching Transactions' });
        }
    };

    return controller;
};
