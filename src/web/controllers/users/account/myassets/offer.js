const listAssets = require('../../../../../../functions/users/account/myassets/list');

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