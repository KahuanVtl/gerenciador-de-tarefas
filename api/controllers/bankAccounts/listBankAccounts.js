module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.ListBankAccounts = async (req, res) => {
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

            logger.info(`Fetching list of bank accounts`);

            const userKey = await pool.query(
                'SELECT id, typeUser FROM securityKeys WHERE id = $1', 
                [Authorization]
            );

            // Check if the user exists in the security database
            if (!Authorization || !userKey.rows[0].typeuser || userKey.rows.length === 0) {
                return res.status(401).json({ message: "Authorization key is required." });
            }

            // If no user is found or typeUser is undefined, treat as a regular user
            if (userKey.rows.length === 0 || !userKey.rows[0].typeuser || userKey.rows[0].typeuser === 'user') {
                const bankAccountsDB = await pool.query(
                    'SELECT id, name, occupation FROM bankAccounts LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Accounts found: ${JSON.stringify(bankAccountsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: bankAccountsDB.rows });
            }

            // If the user is an admin, return all data with pagination
            if (userKey.rows[0].typeuser === 'admin') {
                const bankAccountsDB = await pool.query(
                    'SELECT cw.id AS "Id_contact", cw.parent_id, cw.name, cw.birth_date, cw.cellphone, cw.phone, cw.email, cw.occupation, cw.state, cw.created_at, ba.total, ba.numero_conta, ba.tipo_conta, ba.saldo_atual, ba.limite_credito, ba.status_conta, ba.data_abertura, ba.data_encerramento FROM customerWallets cw LEFT JOIN bankAccounts ba ON cw.parent_id = ba.numero_conta LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Accounts found: ${JSON.stringify(bankAccountsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: bankAccountsDB.rows });
            }

        } catch (error) {
            logger.error(`Error fetching accounts: ${error.message}`);
            return res.status(500).json({ message: 'Error fetching accounts' });
        }
    };

    return controller;
};
