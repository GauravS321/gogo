const listAssets = require('../../../../../functions/plugins/sam/loyalty/list');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await listAssets(req.user.primechain_address);

        return res.render('plugins/sam/loyalty/transfer', {
            assets: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}