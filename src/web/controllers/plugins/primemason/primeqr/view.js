const primeqr = require('../../../../models/plugins/primemason/primeqr');
const moment = require('moment');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const uuid = req.query.uuid;

            const record = await primeqr.findOne({ uuid });

            const { geo_latitude, geo_longitude } = record.json;
            // let current_date = Date.now();
            // let best_before_date = moment(record.json['Best before date']);
            // let expiry_date = moment(record.json['Expiry date']);
            // let best_before = best_before_date.diff(current_date);
            // let expired = expiry_date.diff(current_date);

            delete record['inputs']['geo_latitude'];
            delete record['inputs']['geo_longitude'];

            console.log(record.json);

            return res.render('plugins/primemason/primeqr/view', {
                best_before: moment().isAfter(moment(record.json['Best before date'])), 
                expired: moment().isAfter(moment(record.json['Expiry date'])), 

                latitude: geo_latitude,
                longitude: geo_longitude,
                dataArr: record.json,
                inputsArr: record.inputs,
                uuid: req.query.uuid,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/primeqr/view', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login');
}