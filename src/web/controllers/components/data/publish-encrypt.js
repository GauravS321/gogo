const publishEncryptedData = require('../../../../../functions/components/data/publish-encrypt');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data/publish-encrypt');
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { data, stream_name } = req.body;
            const response = await publishEncryptedData(req.user.primechain_address, data, stream_name);

            return res.json({
                success: true,
                tx_id_enc_data: response.msg.tx_id_enc_data,
                tx_id_signature: response.msg.tx_id_signature,
                signature: response.msg.signature,
                password: response.msg.aes_password,
                iv: response.msg.aes_iv
            })
        } catch (error) {
            res.json({
                success: false
            });
        }
    }
}
