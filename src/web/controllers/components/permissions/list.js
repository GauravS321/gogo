const { listPermissions } = require('../../../../../functions/components/permissions');

// List permissions
module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await listPermissions(req.user.primechain_address);

        return res.render('components/permissions/list', {
            list_permissions: response.msg.primechain_address,
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/login');
};