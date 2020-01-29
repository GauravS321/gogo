const send = require('../../../../../../functions/users/account/myassets/send')
module.exports.get = (req, res) => {
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
module.exports.get_thru_qr = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        const name = (req.params.name) ? req.params.name : "";
        const primechain_address = (req.params.primechain_address) ? req.params.primechain_address : "";

        return res.render('users/account/send_thru_qr',
            {
                asset_name: name,
                primechain_address,
                username: req.user.username,
                email: req.user.email,
            });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { receiver_address, asset_name, quantity, asset_description } = req.body;

            let response = await send(req.user.primechain_address, receiver_address, asset_name, quantity, asset_description);

            if (response.status === 200) {
                req.flash('success_msg', "Asset successfully transferred.")
                return res.redirect('/account/myassets/transfer')
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