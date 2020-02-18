const multer = require('multer');
const path = require('path');
const { issue } = require('../../../../../../functions/plugins/dave/bank-guarantee');

// Set storage Engine
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const Uploads = multer({
    storage: storage
}).array('primechainImages');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('plugins/dave/bank-guarantee/issue', {
            username: req.user.username,
            email: req.user.email
        });
    }
    return res.redirect('/login');
}

module.exports.post = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        Uploads(req, res, async (err) => {
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            }
            try {
                const trade_channel_name = req.body.trade_channel_name;
                let response = await issue(req.user.primechain_address, req.body);

                return res.json({
                    success: true,
                    tx_id_enc_data: response.msg['tx_id_enc_data'],
                    tx_id_signature: response.msg['tx_id_signature'],
                    signature: response.msg['signature'],
                    aes_password: response.msg['aes_password'],
                    aes_iv: response.msg['aes_iv'],
                    trade_channel_name: trade_channel_name
                });
            } catch (error) {
                console.log(error);

                return res.json({
                    success: false,
                    message: error.message
                });
            }
        })
    }
    else {
        return res.redirect('/login');
    }
}
