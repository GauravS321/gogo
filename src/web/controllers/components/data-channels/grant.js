const grant = require('../../../../../functions/components/data-channels/grant');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data-channels/grant', {
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { trade_channel_writer, trade_channel_name } = req.body;
            await grant(trade_channel_writer, trade_channel_name, req.user.primechain_address);

            req.flash("success_msg", "Permissions granted")
            return res.redirect('/components/data-channels/grant');
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('/components/data-channels/grant');
        }
    }
    return res.redirect('/login');
}