const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.post = async (req, res) => {
    try {
        let uuid = req.body.uuid;
        let json = req.body;
        delete json['uuid'];
        json['date'] = new Date.now();

        await logistics.findOneAndUpdate({ uuid }, { $push: { inputs: json } });
        const record = await logistics.findOne({ uuid });
        return res.render('plugins/primemason/logistics/view-inputs', {
            uuid,
            data: true,
            dataArr: record.json,
            inputsArr: record.inputs,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });

    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/logistics/manage');
    }
}