module.exports = app => {
    const controller = app.controllers.transactions;

    app.route('/api/v1/transactions')
        .get(controller.listTransactions.listTransactions)
        .post(controller.searchTransactions.searchTransactions)
        .put(controller.insertTransaction.InsertTransaction)
}