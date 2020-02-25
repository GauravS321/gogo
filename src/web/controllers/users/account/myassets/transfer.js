const listAssets = require('../../../../../../functions/users/account/myassets/list');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await listAssets(req.user.primechain_address);

            return res.render('users/account/transfer', {
                assets: response.msg,
                primechain_address: req.user.primechain_address
            });
        } catch (error) {
            return res.render('users/account/transfer', {
                primechain_address: req.user.primechain_address
            });
        }

    }
    return res.redirect('/login');
}