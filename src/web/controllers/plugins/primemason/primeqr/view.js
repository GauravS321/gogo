const primeqr = require('../../../../models/plugins/primemason/primeqr');
const moment = require('moment');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const uuid = req.query.uuid;

            const record = await primeqr.findOne({ uuid });

            const { geo_latitude, geo_longitude } = record.json;
            
            delete record['inputs']['geo_latitude'];
            delete record['inputs']['geo_longitude'];


            return res.render('plugins/primemason/primeqr/view', {
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