const downloadDecryptedData = require('../../../../../functions/components/data/download-decrypt');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data/download-decrypt', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { txid_data, txid_signature, password, iv, stream_name } = req.body;

            let response = await downloadDecryptedData(txid_data, txid_signature, password, iv, stream_name);

            return res.render('components/data/view-decrypt-data', {
                data: response.msg.data,
                signerDetails: response.msg.signer_detail.primechain_address,
                signature: response.msg.signature_status,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('components/data/view-decrypt-data', {
                error_msg: "Internal server error"
            });
        }
    }
}