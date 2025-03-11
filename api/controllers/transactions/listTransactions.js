module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.listTransactions = async (req, res) => {
        try {
            const Authorization = req.headers.authorization;
            let { page = 1, limit = 10 } = req.query; // Get page and limit parameters from the query string

            // Check if parameters are valid (integers)
            page = parseInt(page);
            limit = parseInt(limit);
            
            if (isNaN(page) || isNaN(limit)) {
                return res.status(400).json({ message: "Fail", motive: "Page or Limit should be a number" });
            }

            // Calculate OFFSET for SQL query
            const offset = (page - 1) * limit;

            logger.info(`Fetching Transactions`);

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
                const transactionsDB = await pool.query(
                    'SELECT id, name, occupation FROM transactions LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Transactions found: ${JSON.stringify(transactionsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: transactionsDB.rows });
            }

            // If the user is an admin, return all data with pagination
            if (userKey.rows[0].typeuser === 'admin') {
                const transactionsDB = await pool.query(
                    'SELECT * FROM transactions LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Transactions found: ${JSON.stringify(transactionsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: transactionsDB.rows });
            }

        } catch (error) {
            logger.error(`Error fetching Transactions: ${error.message}`);
            return res.status(500).json({ message: 'Error fetching Transactions' });
        }
    };

    return controller;
};
