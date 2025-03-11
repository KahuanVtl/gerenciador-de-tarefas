module.exports = app => {
    const logger = require('../../../config/logger');
    const keys = require('../../utils/queries');
    const queries = require('./utils/queries');
    const controller = {};

    controller.ListCustomerWallets = async (req, res) => {
        try {
            const Authorization = req.headers.authorization;
            let { page = 1, limit = 10 } = req.query;

            // Convertendo para inteiro e validando
            page = parseInt(page);
            limit = parseInt(limit);
            if (isNaN(page) || isNaN(limit)) {
                return res.status(400).json({ message: "Fail", motive: "Page or Limit should be a number" });
            }

            // Cálculo do offset para paginação
            const offset = (page - 1) * limit;
            logger.info(`Fetching wallets`);

            // Validação da chave de autorização
            const userKey = await keys.getUserKey(Authorization);
            if (!Authorization || !userKey || !userKey.typeuser) {
                return res.status(401).json({ message: "Authorization key is required." });
            }

            // Buscar as carteiras conforme o tipo de usuário
            const customerWallets = await queries.getCustomerWallets(userKey.typeuser, limit, offset);
            logger.info(`Wallets found: ${JSON.stringify(customerWallets)}`);

            return res.status(200).json({ message: "Success", data: customerWallets });

        } catch (error) {
            logger.error(`Error fetching wallets: ${error.message}`);
            return res.status(500).json({ message: 'Error fetching wallets', motive: error.message });
        }
    };

    return controller;
};
