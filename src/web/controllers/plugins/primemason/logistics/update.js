const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let data = await logistics.findOne({ uuid: req.query.uuid });

            return res.render('plugins/primemason/logistics/update', {
                dataArr: data.json,
                uuid: data.uuid,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/logistics/update', {
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

           await logistics.findOneAndUpdate({ uuid }, { json });

            req.flash("success_msg", "Shop details updated. ", uuid);
            return res.redirect('/plugins/primemason/logistics/manage');
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/logistics/manage');
    }
}