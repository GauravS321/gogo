const { User } = require('../../../models/users/user');
// User management

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const users_list = [];
            const users = await User.find();

            users.forEach(user => {
                if (req.user.email !== user.email) {
                    users_list.push({
                        name: user.username,
                        email: user.email,
                        user_role: user.role,
                        primechain_address: user.primechain_address
                    });
                }
            });

            return res.render('components/user-management/list', {
                users_list,
            })
        } catch (error) {
            return res.render('components/user-management/list');
        }
    }
    return res.redirect('/login')
}