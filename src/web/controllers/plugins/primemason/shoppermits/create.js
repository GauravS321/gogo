const { create } = require('../../../../../../functions/plugins/primemason/shoppermits');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('plugins/primemason/shoppermits/create', {
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            const response = await create(req.body);

            req.flash("success_msg", "Shop created. ", response.msg['uuid']);
            return res.redirect('/plugins/primemason/shoppermits/create');
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/shoppermits/create');
    }
}