const createOffer = require('../../../../../../functions/users/account/myassets/create-offer');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const name = (req.params.name) ? req.params.name : "";
            let response = await listAssets(req.user.primechain_address);

            return res.render('users/account/offer', {
                asset_name: name,
                username: req.user.username,
                email: req.user.email,
                primechain_address: req.user.primechain_address
            });
        } catch (error) {
            return res.render('users/account/offer', {
                username: req.user.username,
                email: req.user.email,
                primechain_address: req.user.primechain_address
            });
        }

    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const primechain_address = req.body.primechain_address;
            const offer_asset_name = req.body.offer_asset_name;
            const offer_asset_quantity = req.body.offer_asset_quantity;
            const ask_asset_name = req.body.ask_asset_name;
            const ask_asset_quantity = req.body.ask_asset_quantity;
            let response = await createOffer(primechain_address, ask_asset_name, ask_asset_quantity, offer_asset_name, offer_asset_quantity);
            req.flash('success_msg', 'Public offer created successfully', response.offer_txid);
            res.redirect('/account/myassets/offer/list');

        } catch (error) {
            req.flash('error_msg', 'Public offer not created');
            res.redirect('/account/myassets/offer/transfer');
        }

    }
    return res.redirect('/login');
}