const list = require('../../../../../functions/plugins/sam/loyalty/list');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await list(req.user.primechain_address);

        return res.render('plugins/sam/loyalty/view', {
            assets: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}