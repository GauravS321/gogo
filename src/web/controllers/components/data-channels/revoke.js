const revoke = require('../../../../../functions/components/data-channels/revoke');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data-channels/revoke', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { trade_channel_writer, trade_channel_name } = req.body;

            let response = await revoke(trade_channel_writer, trade_channel_name, req.user.primechain_address);

            req.flash('success_msg', "Permissioned revoked TX ID: " + response.msg);
            return res.redirect('/components/data-channels/revoke');
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('/components/data-channels/revoke');
        }
    }
    return res.redirect('/login');
}