const listAssets = require('../../../../../../functions/users/account/myassets/list');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await listAssets(req.user.primechain_address);

            return res.render('users/account/transfer', {
                assets: response.msg,
                username: req.user.username,
                email: req.user.email,
                primechain_address: req.user.primechain_address
            });
        } catch (error) {
            return res.render('users/account/transfer', {
                username: req.user.username,
                email: req.user.email,
                primechain_address: req.user.primechain_address
            });
        }

    }
    return res.redirect('/login');
}