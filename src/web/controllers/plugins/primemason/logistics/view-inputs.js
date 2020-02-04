const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    try {
        const uuid = req.query.uuid;

        const record = await logistics.findOne({ uuid });

        return res.render('plugins/primemason/logistics/view-inputs', {
            data: record.json,
            dataArr: record.inputs,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/primemason/logistics/view-inputs', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}