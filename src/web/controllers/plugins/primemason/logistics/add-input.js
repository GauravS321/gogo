const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            let uuid = req.body.uuid;
            let inputs = req.body;
            delete json['uuid'];
            await logistics.findOneAndUpdate({uuid},{$push: {inputs:json}});

            req.flash("success_msg", "Input added. ", uuid);
            return res.redirect('/plugins/primemason/logistics/manage');
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/logistics/manage');
    }
}