module.exports = app => {
    const FieldValidator = require('../../utils/fieldValidator');
    const pool = require('../../../config/database');
    const controller = {};

    controller.InsertCustomerWallets = async (req, res) => {
        try {
            const Body = req.body;
            const {name, birthDate, cellphone, phone, email, occupation, state} = req.body; 
            const requiredFields = [ "name", "birthDate", "cellphone", "phone", "email", "occupation", "state"];
            const isValid = FieldValidator.validate(Body, requiredFields);

            if (Object.keys(Body).length === 0 || !isValid) {
                return res.status(500).json({ message: "Fail", motive: `Required properties in body: ${requiredFields.join(", ")}` });
            }

            const lastId = await pool.query('select * from customerWallets order by id DESC limit 1');
            const newId = parseInt(lastId.rows[0].id) + 1;

            const query = `
                INSERT INTO customerWallets (id, name, birth_date, cellphone, phone, email, occupation, state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;`

            const values = [newId, name, birthDate, cellphone, phone, email, occupation, state];

            const customerWalletsDB = await pool.query(query, values);
            
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
