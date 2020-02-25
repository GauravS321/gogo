const createOffer = require('../../../../../../functions/users/account/myassets/create-offer');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const asset_name = (req.params.name) ? req.params.name : "";

            return res.render('users/account/offer', {
                asset_name,
                primechain_address: req.user.primechain_address
            });
        } catch (error) {
            return res.render('users/account/offer', {
                primechain_address: req.user.primechain_address
            });
        }
    }
    else {
        return res.redirect('/login');
    }

}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { primechain_address, offer_asset_name, offer_asset_quantity, ask_asset_name, ask_asset_quantity } = req.body;

            let response = await createOffer(primechain_address, ask_asset_name, ask_asset_quantity, offer_asset_name, offer_asset_quantity);

            req.flash('success_msg', 'Public offer created successfully', response.msg.offer_tx_id);
            return res.redirect('/account/myassets/offer/list');

        } catch (error) {
            console.log(error);

            req.flash('error_msg', 'Public offer not created');
            return res.redirect('/account/myassets/offer/transfer');
        }

    }
    else {
        return res.redirect('/login');
    }

}