const { retrieve } = require('../../../../../../functions/plugins/dave/indkyc');

module.exports.get = async (req, res) => {
    try {
        let response = await retrieve(req.query);
        let data = response.msg.data;
        let image = data['image'];

        delete data['image'];
        return res.render('plugins/dave/indkyc/verification', {
            data,
            image
        });
    } catch (error) {
        return res.render('plugins/dave/indkyc/verification', {
            error_msg: error.error
        });
    }
}
module.exports.getQRCode = async (req, res) => {
    try {
        const { text, txid_signature, password, iv, trade_channel_name } = req.query;

        return res.render('plugins/dave/indkyc/qrcode', {
            data: `${text}&txid_signature=${txid_signature}&password=${password}&iv=${iv}&trade_channel_name=${trade_channel_name}`
        });
    } catch (error) {
        return res.render('plugins/dave/indkyc/verification', {
            error_msg: error.error
        });
    }
}