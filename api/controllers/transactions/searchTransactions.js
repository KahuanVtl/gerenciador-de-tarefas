module.exports = app => {
    const logger = require('../../../config/logger');
    const queries = require('./utils/queries');
    const controller = {};

    controller.searchTransactions = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                logger.warn("Attempt to search without a provided ID.");
                return res.status(400).json({ message: "Fail", motive: "Body does not exist or is incomplete" });
            }

            logger.info(`Searching for transactions for the client with ID: ${id}`);

            const transactionsDB = await queries.searchTransactionsByParentId(id);

            if (transactionsDB.length === 0) { // Correção aqui
                logger.info(`No transactions found for the client with ID: ${id}`);
                return res.status(200).json({ message: "Fail", motive: `No transactions found for the client with ID: ${id}` });
            }

            logger.info(`Transactions found for client ${id}: ${JSON.stringify(transactionsDB)}`);
            return res.status(200).json({ message: "Success", data: transactionsDB });

        } catch (error) {
            logger.error(`Error searching for transactions: ${error.message}`);
            return res.status(500).json({ message: 'Error searching for transactions', motive: error.message });
        }
    };

    return controller;
};
