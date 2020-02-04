const { create } = require('../../../../../../functions/plugins/primemason/logistics');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('plugins/primemason/logistics/create', {
            username: req.user.username,
            email: req.user.email
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            let response = await create(req.body);

            req.flash("success_msg", "LR created. ", response.msg['uuid']);
            return res.redirect('/plugins/primemason/logistics/create');
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/logistics/create');
    }
}