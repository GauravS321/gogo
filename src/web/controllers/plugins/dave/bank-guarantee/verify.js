const { retrieve } = require('../../../../../../functions/plugins/dave/bank-guarantee');

module.exports.get = async (req, res) => {
    try {
        const response = await retrieve(req.query);

        return res.render('plugins/dave/bank-guarantee/verification', {
            data: response.msg['data'],
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    } catch (error) {
        return res.render('plugins/dave/bank-guarantee/verification', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : ""
        });
    }
}

module.exports.getQRCode = async (req, res) => {
    try {
        const { text, txid_signature, password, iv, trade_channel_name } = req.query;

        return res.render('plugins/dave/bank-guarantee/qrcode', {
            data: `${text}&txid_signature=${txid_signature}&password=${password}&iv=${iv}&trade_channel_name=${trade_channel_name}`,
            username: req.user.username,
            email: req.user.email,
        });
    }
    catch (error) {
        return res.render('plugins/dave/bank-guarantee/verification', {
            username: req.user.username,
            email: req.user.email,
            error_msg: error.error
        });
    }
}

