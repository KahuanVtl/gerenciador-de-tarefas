module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.ListCustomerWallets = async (req, res) => {
        try {
            const Authorization = req.headers.authorization;
            let { page = 1, limit = 10 } = req.query; // Get pagination parameters from the query string

            // Validate if the parameters are valid integers
            page = parseInt(page);
            limit = parseInt(limit);
            
            if (isNaN(page) || isNaN(limit)) {
                return res.status(400).json({ message: "Fail", motive: "Page or Limit should be a number" });
            }

            // Calculate the OFFSET for the SQL query
            const offset = (page - 1) * limit;

            logger.info(`Fetching wallets`);

            // If the user does NOT provide Authorization, return basic data with pagination
            
            const userKey = await pool.query(
                'SELECT id, typeUser FROM securityKeys WHERE id = $1', 
                [Authorization]
            );

            // Check if the user exists in the security database
            if (!Authorization || !userKey.rows[0].typeuser || userKey.rows.length === 0) {
                return res.status(401).json({ message: "Authorization key is required." });
            }

            // If no user is found or typeUser is undefined, treat as a regular user
            if (userKey.rows[0].typeuser === 'user') {
                const customerWalletsDB = await pool.query(
                    'SELECT id, name, occupation FROM customerWallets LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Wallets found: ${JSON.stringify(customerWalletsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
            }

            // If the user is an admin, return all data with pagination
            if (userKey.rows[0].typeuser === 'admin') {
                const customerWalletsDB = await pool.query(
                    'SELECT * FROM customerWallets LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Wallets found: ${JSON.stringify(customerWalletsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
            }

        } catch (error) {
            logger.error(`Error fetching wallets: ${error.message}`);
            return res.status(500).json({ message: 'Error fetching wallets' });
        }
    };

    return controller;
};
