const primeqr = require('../../../../models/plugins/primemason/primeqr');

module.exports.get = async (req, res) => {
    try {
        const record = await primeqr.findOne({ uuid: req.query.uuid });
        let image = record.json['image'];

        delete record.json['image'];

        return res.render('plugins/primemason/primeqr/view', {
            image,
            shopname: record.json['Shop Name'],
            ownername: record.json['Owner Name'],
            dataArr: record.permits
        });
    } catch (error) {
        return res.render('plugins/primemason/primeqr/view', {
            error_msg: error.error
        });
    }
}

module.exports.getQRCode = async (req, res) => {
    try {
        const text = req.query.text;

        return res.render('plugins/primemason/primeqr/qrcode', {
            data: `${text}`,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    } catch (error) {
        return res.render('plugins/primemason/primeqr/qrcode', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
}