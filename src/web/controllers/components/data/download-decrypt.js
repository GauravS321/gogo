const downloadDecryptedData = require('../../../../../functions/components/data/download-decrypt');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data/download-decrypt');
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { txid_data, txid_signature, password, iv, stream_name } = req.body;
            const response = await downloadDecryptedData(txid_data, txid_signature, password, iv, stream_name);

            return res.render('components/data/view-decrypt-data', {
                data: response.msg.data,
                signerDetails: response.msg.signer_detail.primechain_address,
                signature: response.msg.signature_status
            });
        } catch (error) {
            return res.render('components/data/view-decrypt-data');
        }
    }
}