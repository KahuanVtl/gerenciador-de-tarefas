module.exports = app => {
    const controller = app.controllers.customerWallets;

    app.route('/api/v1/customer-wallets')
        .get(controller.listCustomerWallets.ListCustomerWallets)
        .post(controller.searchCustomerWallets.SearchCustomerWallets)
}