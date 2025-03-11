module.exports = app => {
    const logger = require('../../../config/logger');
    const queries = require('./utils/queries');
    const controller = {};

    controller.SearchCustomerWallets = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                logger.warn("Attempt to search without a provided ID.");
                return res.status(400).json({ message: "Fail", motive: "Body does not exist or is incomplete" });
            }

            logger.info(`Searching for wallets for the customer with ID: ${id}`);

            const customerWalletsDB = await queries.searchCustomerWalletsById(id);

            if (customerWalletsDB.length === 0) {
                logger.info(`No wallet found for the customer with ID: ${id}`);
                return res.status(200).json({ message: "Success", data: null });
            }

            logger.info(`Wallet found for customer ${id}: ${JSON.stringify(customerWalletsDB)}`);
            return res.status(200).json({ message: "Success", data: customerWalletsDB });

        } catch (error) {
            logger.error(`Error searching for wallets: ${error.message}`);
            return res.status(500).json({ message: 'Error searching for wallets', motive: error.message });
        }
    };

    return controller;
};
