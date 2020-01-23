const { list, manage } = require('../../../../../functions/components/permissions');

// Manage permissions
exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let user_permissions = {};

        const list_permissions = await list(req.user.primechain_address);

        list_permissions.msg.primechain_address.forEach(permission => {
            user_permissions[[permission.type]] = true;
        });

        return res.render('components/permissions/manage', {
            list_permissions: user_permissions,
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
};

exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { action, permission } = req.body;

            let response = await manage(action, req.user.primechain_address, permission);

            if (response.msg.status === 200) {
                return res.json({
                    success: true
                })
            }
            else {
                return res.json({
                    success: false,
                    message: response.msg.message
                });
            }
        } catch (error) {
            return res.json({
                success: false,
                message: "Internal server error!!!"
            });
        }
    }
    res.redirect('/login');
};