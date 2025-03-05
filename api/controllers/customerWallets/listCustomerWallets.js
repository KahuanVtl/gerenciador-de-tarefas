module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.ListCustomerWallets = async (req, res) => {
        try {
            const Authorization = req.headers.authorization;
            logger.info(`Buscando carteiras`);
            // Se o usuário NÃO passar Authorization, retorna os dados básicos
            if (!Authorization) {
                const customerWalletsDB = await pool.query('SELECT id, name, occupation FROM customerWallets');
                logger.info(`Carteiras encontradas: ${JSON.stringify(customerWalletsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
            }

            // Busca o usuário na base de segurança 
            const userKey = await pool.query(
                'SELECT id, typeUser FROM securityKeys WHERE id = $1', 
                [Authorization]
            );

            // Se não encontrou usuário ou se typeUser for indefinido, trata como user comum
            if (userKey.rows.length === 0 || !userKey.rows[0].typeuser || userKey.rows[0].typeuser === 'user') {
                const customerWalletsDB = await pool.query('SELECT id, name, occupation FROM customerWallets');
                logger.info(`Carteiras encontradas: ${JSON.stringify(customerWalletsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
            }

            // Se for admin, retorna todos os dados
            if (userKey.rows[0].typeuser === 'admin') {
                const customerWalletsDB = await pool.query('SELECT * FROM customerWallets');
                logger.info(`Carteiras encontradas: ${JSON.stringify(customerWalletsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
            }

        } catch (error) {
            logger.error(`Erro ao buscar Wallets: ${error.message}`);
            res.status(500).json({ message: 'Erro ao buscar Wallets' });
        }
    };

    return controller;
};
