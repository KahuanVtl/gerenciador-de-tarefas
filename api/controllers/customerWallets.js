module.exports= () => {
    const customerWalletsDB = require('../data/customerWallets.json');
    const controller = {};

    controller.listCustomerWallets = (req, res) => res.status(200).json(customerWalletsDB);

    return controller;
}