const logistics = require('../../../../models/plugins/primemason/logistics');
const moment = require('moment');

module.exports.post = async (req, res) => {
    try {
        let uuid = req.body.uuid;
        let json = req.body;

        delete json['uuid'];
        json['Date'] = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a');
        json['Full name'] = (req.user) ? req.user.username : 'NA';
        json['Email'] = (req.user) ? req.user.email : 'NA';

        await logistics.findOneAndUpdate({ uuid }, { $push: { inputs: json } });

        const record = await logistics.findOne({ uuid });

        return res.render('plugins/primemason/logistics/view-inputs', {
            uuid,
            data: true,
            dataArr: record.json,
            inputsArr: record.inputs
        });
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/logistics/manage');
    }
}