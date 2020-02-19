const primeqr = require('../../../../models/plugins/primemason/primeqr');
const moment = require('moment');

module.exports.get = async (req, res) => {
    try {
        const uuid = req.query.uuid;

        const record = await primeqr.findOne({ uuid });
        let image = record.json['image'];
        let best_before = moment().isBefore(record.json['Best before date']);
        console.log(best_before);

        let expired = moment().isBefore(record.json['Expiry date']);
        console.log(expired);

        delete record.json['image'];

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