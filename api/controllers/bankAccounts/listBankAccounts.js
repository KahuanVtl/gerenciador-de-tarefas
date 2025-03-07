module.exports = app => {
    const pool = require('../../../config/database');
    const logger = require('../../../config/logger');
    const controller = {};

    controller.ListBankAccounts = async (req, res) => {
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

            logger.info(`Buscando Lista de Contas de banco`);

            const userKey = await pool.query(
                'SELECT id, typeUser FROM securityKeys WHERE id = $1', 
                [Authorization]
            );

            // Busca o usuário na base de segurança
            if (!Authorization || !userKey.rows[0].typeuser || userKey.rows.length === 0) {
                return res.status(401).json({ message: "Authorization key is required." });
            }

            // Se não encontrou usuário ou se typeUser for indefinido, trata como user comum
            if (userKey.rows.length === 0 || !userKey.rows[0].typeuser || userKey.rows[0].typeuser === 'user') {
                const bankAccountsDB = await pool.query(
                    'SELECT id, name, occupation FROM bankAccounts LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Carteiras encontradas: ${JSON.stringify(bankAccountsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: bankAccountsDB.rows });
            }

            // Se for admin, retorna todos os dados com paginação
            if (userKey.rows[0].typeuser === 'admin') {
                const bankAccountsDB = await pool.query(
                    'select cw.id as "Id_contact", cw.parent_id, cw.name, cw.birth_date, cw.cellphone, cw.phone, cw.email, cw.occupation, cw.state, cw.created_at, ba.total, ba.numero_conta, ba.tipo_conta, ba.saldo_atual, ba.limite_credito, ba.status_conta, ba.data_abertura, ba.data_encerramento from customerWallets cw left join bankAccounts ba on cw.parent_id = ba.numero_conta LIMIT $1 OFFSET $2', 
                    [limit, offset]
                );
                logger.info(`Carteiras encontradas: ${JSON.stringify(bankAccountsDB.rows)}`);
                return res.status(200).json({ message: "Success", data: bankAccountsDB.rows });
            }

        } catch (error) {
            logger.error(`Erro ao buscar Wallets: ${error.message}`);
            return res.status(500).json({ message: 'Erro ao buscar Wallets' });
        }
    };

    return controller;
};
