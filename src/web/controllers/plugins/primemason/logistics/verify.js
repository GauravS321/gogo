const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    try {
        const record = await logistics.findOne({ uuid: req.query.uuid });

        return res.render('plugins/primemason/logistics/view', {
            shopname: record.json['Shop Name'],
            ownername: record.json['Owner Name'],
            dataArr: record.permits,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/primemason/logistics/view', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}

module.exports.getQRCode = async (req, res) => {
    try {
        const text = req.query.text;

        return res.render('plugins/primemason/logistics/qrcode', {
            data: `${text}`,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/primemason/logistics/qrcode', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}