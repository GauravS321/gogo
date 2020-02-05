const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.post = async (req, res) => {
    try {
        let uuid = req.body.uuid;
        let json = req.body;
        delete json['uuid']


        await logistics.findOneAndUpdate({ uuid }, { $push: { inputs: json } });

        req.flash("success_msg", "Input added. ", uuid);
        return res.redirect('/plugins/primemason/logistics/manage');

    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/logistics/manage');
    }
}