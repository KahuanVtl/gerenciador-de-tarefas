module.exports= app => {
    const customerWalletsDB = app.data.customerWallets;
    const controller = {};

    controller.ListCustomerWallets = (req, res) => res.status(200).json(customerWalletsDB);
    
    return controller;
}