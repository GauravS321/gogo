const primeqr = require('../../../../models/plugins/primemason/primeqr');
const moment = require('moment');

module.exports.get = async (req, res) => {
    try {
        const uuid = req.query.uuid;

        const record = await primeqr.findOne({ uuid });
        let image = record.json['image'];
        record.json['manufactured_display'] = moment(record.json['Manufacturing date'], "DD-MMM-YYYY");
        record.json['best_before_display'] = moment(record.json['Best before date'], "DD-MMM-YYYY");
        record.json['expiry_display'] = moment(record.json['Expiry date'], "DD-MMM-YYYY");

        let best_before = moment().isAfter(record.json['Best before date']);
        let expired = moment().isAfter(record.json['Expiry date']);

        delete record.json['Manufacturing date'];
        delete record.json['Best before date'];
        delete record.json['Expiry date'];

        return res.render('plugins/primemason/primeqr/view-inputs', {
            best_before,
            expired,
            image,
            uuid,
            dataArr: record.json,
            inputsArr: record.inputs,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/primemason/primeqr/view-inputs', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}