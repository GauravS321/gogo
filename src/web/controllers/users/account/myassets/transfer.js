const listAssets = require('../../../../../../functions/components/sam/list');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await listAssets(req.user.primechain_address);

            return res.render('users/account/transfer', {
                assets: response.msg,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('users/account/transfer', {
                username: req.user.username,
                email: req.user.email,
            });
        }

    }
    return res.redirect('/login');
}