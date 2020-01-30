const { retrieve } = require('../../../../../../functions/plugins/dave/academic');

module.exports.get = async (req, res) => {
    try {
        let response = await retrieve(req.query);

        return res.render('plugins/dave/academic/verification', {
            data: response.msg['data'],
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/dave/academic/verification', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}
module.exports.getQRCode = async (req, res) => {
    try {
        const { text, txid_signature, password, iv, trade_channel_name } = req.query;

        return res.render('plugins/dave/academic/qrcode', {
            data: `${text}&txid_signature=${txid_signature}&password=${password}&iv=${iv}&trade_channel_name=${trade_channel_name}`,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/dave/academic/verification', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}