const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    try {
        const record = await logistics.findOne({ uuid: req.query.uuid });
        let image = record.json['image'];

        delete record.json['image'];

        return res.render('plugins/primemason/logistics/view', {
            image,
            shopname: record.json['Shop Name'],
            ownername: record.json['Owner Name'],
            dataArr: record.permits
        });
    } catch (error) {
        return res.render('plugins/primemason/logistics/view', {
            error_msg: error.error
        });
    }
}

module.exports.getQRCode = async (req, res) => {
    try {
        const text = req.query.text;

        return res.render('plugins/primemason/logistics/qrcode', {
            data: `${text}`
        });
    } catch (error) {
        return res.render('plugins/primemason/logistics/qrcode', {
            error_msg: error.error
        });
    }
}