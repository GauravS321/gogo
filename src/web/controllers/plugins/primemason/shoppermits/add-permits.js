const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('plugins/primemason/shoppermits/addpermit', {
            uuid: req.query.uuid,
            username: req.user.username,
            email: req.user.email
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            let uuid = req.body.uuid;
            let json = req.body;
            delete json['uuid'];
            await shoppermits.findOneAndUpdate({uuid},{$push: {permits:json}});

            req.flash("success_msg", "Permit added. ", uuid);
            return res.redirect('/plugins/primemason/shoppermits/manage-permits');
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/shoppermits/manage-permits');
    }
}