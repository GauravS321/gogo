const { create } = require('../../../../../functions/components/wizard');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/wizard/create', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            let response = await create(req.body);

            req.flash("success_msg", "Data instered and id", response.msg['_id']);
            return res.redirect('/components/curd-wizard/create');
        }
    } catch (error) {
        req.flash('error_msg', "Internal server error!!!");
        return res.redirect('/components/curd-wizard/create');
    }

}