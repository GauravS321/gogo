const primeqr = require('../../../../models/plugins/primemason/primeqr');
const moment = require('moment');

module.exports.get = async (req, res) => {
    try {
        const uuid = req.query.uuid;

        const record = await primeqr.findOne({ uuid });
        let image = record.json['image'];
        record.json['manufactured_display'] = moment(record.json['Manufacturing date']).format('ll');
        record.json['best_before_display'] = moment(record.json['Best before date']).format('ll');
        record.json['expiry_display'] = moment(record.json['Expiry date']).format('ll');

        let best_before = moment().isAfter(record.json['Best before date']);
        let expired = moment().isAfter(record.json['Expiry date']);

        let comment_image = records.inputs['comment_image'];
        delete records.inputs['comment_image'];
        let latitude = (records.inputs.geo_latitude.length > 0) ? true: delete records.inputs.geo_latitude;
        let longtitude = (records.inputs.geo_longitude.length > 0) ? true: delete records.inputs.geo_longitude;

        // delete record.json['Best before date'];
        // delete record.json['Expiry date'];

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