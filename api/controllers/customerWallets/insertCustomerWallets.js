module.exports = app => {
    const FieldValidator = require('../../utils/fieldValidator');
    const queries = require('./utils/queries');
    const controller = {};

    controller.InsertCustomerWallets = async (req, res) => {
        try {
            const Body = req.body;
            const { name, birthDate, cellphone, phone, email, occupation, state } = req.body; 
            const requiredFields = ["name", "birthDate", "cellphone", "phone", "email", "occupation", "state"];

            if (!FieldValidator.validate(Body, requiredFields) || Object.keys(Body).length === 0) {
                return res.status(400).json({ message: "Fail", motive: `Required properties in body: ${requiredFields.join(", ")}` });
            }

            // Obtém o último ID e calcula o novo ID
            const lastId = await queries.getLastCustomerWalletId();
            const newId = lastId + 1;

            // Insere os dados no banco
            const customerWallet = await queries.insertCustomerWallet({ 
                id: newId, name, birthDate, cellphone, phone, email, occupation, state 
            });

            if (!customerWallet) {
                return res.status(200).json({ message: "Success", data: "No wallet found, change your body filters" });
            }

            return res.status(200).json({ message: "Success", data: customerWallet });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error inserting wallet' });
        }
    };
    
    return controller;
};
