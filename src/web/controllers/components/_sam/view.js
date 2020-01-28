const list = require('../../../../../functions/components/sam/list');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await list(req.user.primechain_address);

        return res.render('components/sam/view', {
            assets: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}