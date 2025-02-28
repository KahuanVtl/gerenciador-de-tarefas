module.exports = app => {
    const pool = require('../../../config/database');
    const controller = {};

    controller.ListCustomerWallets = async (req, res) => {
        try {
            const customerWalletsDB = await pool.query('SELECT * FROM customerWallets')
            return res.status(200).json({ message: "Success", data: customerWalletsDB.rows });
        } catch (error){
            console.log(error);
            res.status(500).json({ message: 'Erro ao buscar Wallets' })
        }
    };
    return controller;
}