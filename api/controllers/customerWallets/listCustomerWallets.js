module.exports = app => {
    const pool = require('../../../config/database');
    const controller = {};

    controller.ListCustomerWallets = async (req, res) => {
        try {
            const customerWalletsDB = await pool.query('SELECT * FROM customerWallets')
            res.status(200).json(customerWalletsDB.rows);
        } catch (error){
            console.log(error);
            res.status(500).json({ message: 'Erro ao buscar Wallets' })
        }
    };

    return controller;
}