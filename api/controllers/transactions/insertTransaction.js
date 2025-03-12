module.exports = (app) => {
    const FieldValidator = require('../../utils/fieldValidator');
    const queries = require('./utils/queries');
    const controller = {};

    controller.InsertTransaction = async (req, res) => {
        try {
            const { parent_id, total, tipo_transacao } = req.body;
            const requiredFields = ["parent_id", "total", "tipo_transacao"];

            // Validação dos campos obrigatórios
            if (!FieldValidator.validate(req.body, requiredFields) || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: "Fail", motive: `Required properties in body: ${requiredFields.join(", ")}` });
            }

            // Buscar a conta bancária
            const bankAccount = await queries.searchAccountByParentId(parent_id);
            if (!bankAccount?.length) {
                return res.status(404).json({ message: "Fail", motive: "Bank Account not found or inexistent" });
            }

            // Definir valores conforme o tipo de transação
            let balanceField, currentBalance;
            if (tipo_transacao === "DÉBITO") {
                balanceField = 'saldo_atual';
                currentBalance = bankAccount[0].saldo_atual;
            } else if (tipo_transacao === "CRÉDITO") {
                balanceField = 'limite_credito';
                currentBalance = bankAccount[0].limite_credito;
            } else {
                return res.status(400).json({ message: "Fail", motive: "Invalid transaction type" });
            }

            // Verificar se há saldo suficiente
            if (currentBalance < total) {
                return res.status(403).json({ message: "Fail", motive: `Insufficient balance on ${tipo_transacao}, try another way` });
            }

            // Processar transação
            const newValue = currentBalance - total;
            const newTransaction = await queries.insertTransactions({ parent_id, total, tipo_transacao });
            const newBalance = await queries.updateAccountById({ typeTransaction: balanceField, newValue, parent_id });

            return res.status(200).json({ message: "Success", newBalance, newTransaction });
        } catch (error) {
            console.error("Transaction Error:", error);
            return res.status(500).json({ message: "Error inserting wallet", error: error.message });
        }
    };

    return controller;
};
