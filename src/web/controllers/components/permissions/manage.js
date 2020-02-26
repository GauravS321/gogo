const { list, manage } = require('../../../../../functions/components/permissions');
const { User } = require('../../../models/users/user');

// Manage permissions
exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let user_permissions = {};
        const user_info = await User.findOne({ primechain_address: req.query.primechain_address });
        const list_permissions = await list(req.query.primechain_address);

        list_permissions.msg.primechain_address.forEach(permission => {
            user_permissions[[permission.type]] = true;
        });

        return res.render('components/permissions/manage', {
            list_permissions: user_permissions,
            user_name: user_info.username,
            user_email: user_info.email,
            user_role: user_info.role,
            primechain_address: req.query.primechain_address,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
            success_msg: (req.query.success_msg) ? req.query.success_msg : "",
            error_msg: (req.query.error_msg) ? req.query.error_msg : ""
        });
    }
    return res.redirect('/login');
};

exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { action, permission, primechain_address } = req.body;
            const response = await manage(action, primechain_address, permission);

            if (response.msg.status === 200) {
                return res.json({
                    success: true,
                    transaction_id: response.msg.tx_id
                });
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