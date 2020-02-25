const { retrieve } = require('../../../../../../functions/plugins/dave/academic');

module.exports.get = async (req, res) => {
    try {
        let response = await retrieve(req.query);

        return res.render('plugins/dave/academic/verification', {
            data: response.msg['data']
        });
    } catch (error) {
        return res.render('plugins/dave/academic/verification', {
            error_msg: error.error
        });
    }
}

module.exports.getQRCode = async (req, res) => {
    try {
        const { text, txid_signature, password, iv, trade_channel_name } = req.query;

        return res.render('plugins/dave/academic/qrcode', {
            data: `${text}&txid_signature=${txid_signature}&password=${password}&iv=${iv}&trade_channel_name=${trade_channel_name}`
        });
    } catch (error) {
        return res.render('plugins/dave/academic/verification', {
            error_msg: error.error
        });
    }
}