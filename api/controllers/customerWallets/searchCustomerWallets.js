module.exports = app => {
    const customerWalletsDB = app.data.customerWallets;
    const controller = {};

    controller.SearchCustomerWallets = (req, res) => {
        const Body = req.body;

        if (Object.keys(Body).length === 0 || !Body.id) {
            return res.status(400).json({ message: "Fail", motive: "Body not exist or incomplete" });
        }

        const wallet = customerWalletsDB.customerWallets.data.find(wallet => wallet.id === Body.id);

        if (wallet === undefined) {
            return res.status(200).json({ message: "Success", data: "Any Wallet found" });
        }

        return res.status(200).json({ message: "Success", data: wallet });
    };

    return controller;
};
