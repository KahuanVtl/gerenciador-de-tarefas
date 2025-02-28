module.exports = app => {
    const pool = require('../../../config/database');
    const controller = {};

    controller.SearchCustomerWallets = async (req, res) => {
        try {
            const Body = req.body;

            if (Object.keys(Body).length === 0 || !Body.id) {
                return res.status(500).json({ message: "Fail", motive: "Body not exist or incomplete" });
            }
            
            const customerWalletsDB = await pool.query(`SELECT * FROM customerWallets WHERE id in ('${Body.id}')`);
            
            if (customerWalletsDB === undefined) {
                return res.status(200).json({ message: "Success", data: "Any Wallet found, change your body filters" });
            }

            return res.status(200).json({ message: "Success", data: customerWalletsDB.rows[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro ao buscar Wallets' })
        }
    };

    return controller;
};
