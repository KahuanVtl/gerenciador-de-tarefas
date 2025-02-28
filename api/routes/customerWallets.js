module.exports = app => {
    const controller = require('../controllers/customerWallets')();

    app.route('/api/v1/customer-wallets')
        .get(controller.listCustomerWallets);
}