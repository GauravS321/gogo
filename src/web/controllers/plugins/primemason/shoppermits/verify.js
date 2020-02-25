const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = async (req, res) => {
    try {
        const record = await shoppermits.findOne({ uuid: req.query.uuid });

        return res.render('plugins/primemason/shoppermits/view-permits', {
            shopname: record.json['Shop Name'],
            ownername: record.json['Owner Name'],
            dataArr: record.permits
        });
    } catch (error) {
        return res.render('plugins/primemason/shoppermits/view-permits', {
            error_msg: error.error
        });
    }
}

module.exports.getQRCode = async (req, res) => {
    try {
        const text = req.query.text;

        return res.render('plugins/primemason/shoppermits/qrcode', {
            data: `${text}`,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    } catch (error) {
        return res.render('plugins/primemason/shoppermits/qrcode', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
}