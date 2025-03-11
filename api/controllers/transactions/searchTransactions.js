module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.searchTransactions = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                logger.warn("Attempt to search without a provided ID.");
                return res.status(400).json({ message: "Fail", motive: "Body does not exist or is incomplete" });
            }

            logger.info(`Searching for wallets for the client with ID: ${id}`);

            const customerWalletsDB = await pool.query(`SELECT * FROM transactions WHERE parent_id = $1`, [id]);

            if (customerWalletsDB.rows.length === 0) {
                logger.info(`No wallets found for the client with ID: ${id}`);
                return res.status(200).json({ message: "Fail", motive: `No wallets found for the client with ID: ${id}` });
            }

            logger.info(`Wallet found for client ${id}: ${JSON.stringify(customerWalletsDB.rows)}`);
            return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });

        } catch (error) {
            logger.error(`Error searching for wallets: ${error.message}`);
            return res.status(500).json({ message: 'Error searching for wallets', motive: error.message });
        }
    };

    return controller;
};
