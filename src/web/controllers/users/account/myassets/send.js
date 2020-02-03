const send = require('../../../../../../functions/users/account/myassets/send');
const list = require('../../../../../../functions/users/account/myassets/list');
const User = require('../../../../models/users/user');


module.exports.get = (req, res) => {
    ;
    if (req.user && req.isAuthenticated()) {
        const name = (req.params.name) ? req.params.name : "";
        const primechain_address = (req.params.primechain_address) ? req.params.primechain_address : "";

        return res.render('users/account/send',
            {
                asset_name: name,
                primechain_address,
                username: req.user.username,
                email: req.user.email,
            });
    }
    return res.redirect('/login');
}

module.exports.get_thru_qr = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        const assetref = (req.params.assetref) ? req.params.assetref : "";
        const primechain_address = (req.params.primechain_address) ? req.params.primechain_address : "";

        if (assetref && primechain_address) {
            let asset_details_arr = await list(req.user.primechain_address);
            let { username } = await User.findOne({ primechain_address: primechain_address })
            let asset_name;
            let asset_found_count = 0;

            asset_details_arr.msg.forEach(asset => {
                if (assetref === asset.assetref) {
                    asset_name = asset.name;
                    asset_found_count++;
                }
            });

            if (asset_found_count === 1) {
                return res.render('users/account/send_thru_qr',
                    {
                        asset_name,
                        primechain_address,
                        username,
                        email: req.user.email,
                    });
            }
            else {
                req.flash('error_msg', "Unable to find asset");
                return res.redirect('/account/myassets/transfer');
            }
        }
        else {
            req.flash('error_msg', "Authentication failed");
            return res.redirect('/account/myassets/transfer');
        }
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { receiver_address, asset_name, quantity, asset_description } = req.body;
            console.log(receiver_address, asset_name, quantity, asset_description);

            let response = await send(req.user.primechain_address, receiver_address, asset_name, quantity, asset_description);

            if (response.status === 200) {
                req.flash('success_msg', "Asset successfully transferred.");
                return res.redirect('/account/myassets/transfer');
            }
        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/account/myassets/transfer');
            }
            else if (error.error) {
                req.flash('error_msg', error.error);
                return res.redirect('/account/myassets/transfer');
            }
            else {
                req.flash('error_msg', error.msg);
                return res.redirect('/account/myassets/transfer');
            }
        }
    }
    return res.redirect('/login');
}