const encryptFile = require('../../../../../functions/components/file/publish-encrypt');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/file/publish-encrypt', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { stream_name } = req.body;
            const file = req.files['file[0]'];

            let response = await encryptFile(req.user.primechain_address, file, stream_name);

            if (response.msg === undefined) {
                return res.json({
                    success: false
                });
            }
            else {
                return res.json({
                    success: true,
                    tx_id_enc_file: response.msg.tx_id_enc_file,
                    tx_id_signature: response.msg.tx_id_signature,
                    signature: response.msg.signature,
                    aes_password: response.msg.aes_password,
                    aes_iv: response.msg.aes_iv,
                    stream_name
                });
            }

        } catch (error) {
            return res.json({
                success: false
            });
        }
    }
}