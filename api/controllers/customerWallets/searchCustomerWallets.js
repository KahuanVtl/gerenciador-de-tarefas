module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.SearchCustomerWallets = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                logger.warn("Tentativa de busca sem ID fornecido.");
                return res.status(400).json({ message: "Fail", motive: "Body not exist or incomplete" });
            }

            logger.info(`Buscando carteiras para o cliente com ID: ${id}`);

            const customerWalletsDB = await pool.query(`SELECT * FROM customerWallets WHERE id = $1`, [id]);

            if (customerWalletsDB.rows.length === 0) {
                logger.info(`Nenhuma carteira encontrada para o cliente com ID: ${id}`);
                return res.status(200).json({ message: "Success", data: null });
            }

            logger.info(`Carteira encontrada para o cliente ${id}: ${JSON.stringify(customerWalletsDB.rows[0])}`);
            return res.status(200).json({ message: "Success", data: customerWalletsDB.rows[0] });

        } catch (error) {
            logger.error(`Erro ao buscar Wallets: ${error.message}`);
            return res.status(500).json({ message: 'Erro ao buscar Wallets' });
        }
    };

    return controller;
};
