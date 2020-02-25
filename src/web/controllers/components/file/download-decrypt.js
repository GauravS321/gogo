const downloadDecryptFile = require('../../../../../functions/components/file/download-decrypt');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/file/download-decrypt', {
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
    return res.redirect('/login');
}

exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { txid_data, txid_signature, password, iv, stream_name } = req.body;

            const response = await downloadDecryptFile(txid_data, txid_signature, password, iv, stream_name);

            const data = Buffer.from(response.msg.data, 'hex').toString();

            res.writeHead(200, {
                'Content-Type': response.msg.mimetype,
                'Content-disposition': 'attachment;filename=' + response.msg.name,
                'Content-Length': data.length
            });

            res.end(data);
        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/components/file/download-decrypt');
            }
            else if (error.message) {
                req.flash('error_msg', error.message);
                return res.redirect('/components/file/download-decrypt');
            }
            else {
                req.flash('error_msg', "Internal server error!!!");
                return res.redirect('/components/file/download-decrypt');
            }
        }
    }
}