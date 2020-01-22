const User = require('../../../models/users/user');
// User management

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const users_list = [];
            const users = await User.find();

            users.forEach(user => {
                users_list.push({
                    name: user.username,
                    email: user.email,
                    primechain_address: user.primechain_address
                });
            });

            return res.render('components/user-management/list', {
                users_list,
                username: req.user.username,
                email: req.user.email,
            })
        } catch (error) {
            return res.render('components/user-management/list', {
                username: req.user.username,
                email: req.user.email,
            });
        }
    }
    return res.redirect('/login')
}