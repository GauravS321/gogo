const { create } = require('../../../../../../functions/users/account/activity-logs');

/**
 * GET /account/my-profile
 * User profile.
 */
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ip_arr = ip.split(':');
        ip = ip_arr[ip_arr.length - 1];
        let browser = req.headers['user-agent'];
  
        await create(email, ip, browser);
        return res.render('users/account/my-profile', {
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            mobile: (req.user.mobile) ? req.user.mobile : "N/A",
            primechain_address: req.user.primechain_address
        });
    }
    return res.redirect('/login');
};