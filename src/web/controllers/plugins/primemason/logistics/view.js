const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const uuid = req.query.uuid;

            const record = await logistics.findOne({ uuid });

            const { geo_latitude, geo_longitude } = record.json;

            delete record['inputs']['geo_latitude'];
            delete record['inputs']['geo_longitude'];

            console.log(record.json);
            

            return res.render('plugins/primemason/logistics/view', {
                latitude: geo_latitude,
                longitude: geo_longitude,
                dataArr: record.json,
                inputsArr: record.inputs,
                uuid: req.query.uuid,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/logistics/view', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login');
}