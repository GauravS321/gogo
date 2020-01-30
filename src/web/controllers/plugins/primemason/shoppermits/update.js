const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let data = await shoppermits.findOne({ uuid: req.query.uuid });

            return res.render('plugins/primemason/shoppermits/update', {
                dataArr: data.json,
                uuid: data.uuid,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/shoppermits/update', {
                username: req.user.username,
                email: req.user.email
            });
        }

    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            let json = req.body;
            let uuid = req.body.uuid;
            delete json['uuid'];

           await shoppermits.findOneAndUpdate({ uuid }, { json });

            req.flash("success_msg", "Shop details updated. ", uuid);
            return res.redirect('/plugins/primemason/shoppermits/manage');
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/shoppermits/manage');
    }
}