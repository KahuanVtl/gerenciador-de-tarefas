module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.listTransactions = async (req, res) => {
        try {
            const Authorization = req.headers.authorization;
            let { page = 1, limit = 10 } = req.query; // Pega os parâmetros de página e limite da query string

            // Verifica se os parâmetros são válidos (inteiros)
            page = parseInt(page);
            limit = parseInt(limit);
            
            if (isNaN(page) || isNaN(limit)) {
                return res.status(400).json({ message: "Fail", motive: "Page or Limit should be a number" });
            }

            // Calcula o OFFSET para a consulta SQL
            const offset = (page - 1) * limit;

            logger.info(`Buscando carteiras`);

            // Se o usuário NÃO passar Authorization, retorna os dados básicos com paginação
            
            const userKey = await pool.query(
                'SELECT id, typeUser FROM securityKeys WHERE id = $1', 
                [Authorization]
            );

            // Busca o usuário na base de segurança
            if (!Authorization || !userKey.rows[0].typeuser || userKey.rows.length === 0) {
                return res.status(401).json({ message: "Authorization key is required." });
            }

            // Se não encontrou usuário ou se typeUser for indefinido, trata como user comum
            if (userKey.rows[0].typeuser === 'user') {
                const customerWalletsDB = await pool.query(
                    'SELECT id, name, occupation FROM customerWallets LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Carteiras encontradas: ${JSON.stringify(customerWalletsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
            }

            // Se for admin, retorna todos os dados com paginação
            if (userKey.rows[0].typeuser === 'admin') {
                const customerWalletsDB = await pool.query(
                    'SELECT * FROM customerWallets LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Carteiras encontradas: ${JSON.stringify(customerWalletsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
            }

        } catch (error) {
            logger.error(`Erro ao buscar Wallets: ${error.message}`);
            return res.status(500).json({ message: 'Erro ao buscar Wallets' });
        }
    };

    return controller;
};
