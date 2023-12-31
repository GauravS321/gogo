const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    try {
        const uuid = req.query.uuid;

        const record = await logistics.findOne({ uuid });
        let image = record.json['image'];

        delete record.json['image'];

        return res.render('plugins/primemason/logistics/view-inputs', {
            image,
            uuid,
            dataArr: record.json,
            inputsArr: record.inputs,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    } catch (error) {
        return res.render('plugins/primemason/logistics/view-inputs', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
}