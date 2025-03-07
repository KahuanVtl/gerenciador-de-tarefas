module.exports = app => {
    const controller = app.controllers.bankAccounts;

    app.route('/api/v1/bank-accounts')
        .get(controller.listBankAccounts.ListBankAccounts)
}