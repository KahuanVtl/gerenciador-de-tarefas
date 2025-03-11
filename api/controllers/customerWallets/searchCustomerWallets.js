module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.SearchCustomerWallets = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                logger.warn("Attempt to search without a provided ID.");
                return res.status(400).json({ message: "Fail", motive: "Body does not exist or is incomplete" });
            }

            logger.info(`Searching for wallets for the customer with ID: ${id}`);

            const customerWalletsDB = await pool.query(`SELECT * FROM customerWallets WHERE id = $1`, [id]);

            if (customerWalletsDB.rows.length === 0) {
                logger.info(`No wallet found for the customer with ID: ${id}`);
                return res.status(200).json({ message: "Success", data: null });
            }

            logger.info(`Wallet found for customer ${id}: ${JSON.stringify(customerWalletsDB.rows[0])}`);
            return res.status(200).json({ message: "Success", data: customerWalletsDB.rows[0] });

        } catch (error) {
            logger.error(`Error searching for wallets: ${error.message}`);
            return res.status(500).json({ message: 'Error searching for wallets' });
        }
    };

    return controller;
};
