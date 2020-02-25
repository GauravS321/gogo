const { list } = require('../../../../../functions/components/permissions');

// List permissions
module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await list(req.query.primechain_address);

        return res.render('components/permissions/list', {
            list_permissions: response.msg.primechain_address
        });
    }
    res.redirect('/login');
};