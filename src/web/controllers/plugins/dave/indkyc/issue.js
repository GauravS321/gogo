const multer = require('multer');
const path = require('path');
const { issue } = require('../../../../../../functions/plugins/dave/indkyc');


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
        return res.render('plugins/dave/indkyc/issue', {
            username: req.user.username,
            email: req.user.email
        });
    }
    return res.redirect('/login');
}

module.exports.post = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        Uploads(req, res, (err) => {            
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            }
            
            let json = req.body;
            json['image'] = req.files[0].path;

            const trade_channel_name = req.body.trade_channel_name;

            issue(req.user.primechain_address, json)
                .then(response => {
                    res.json({
                        success: true,
                        tx_id_enc_data: response.msg['tx_id_enc_data'],
                        tx_id_signature: response.msg['tx_id_signature'],
                        signature: response.msg['signature'],
                        aes_password: response.msg['aes_password'],
                        aes_iv: response.msg['aes_iv'],
                        trade_channel_name: trade_channel_name
                    });
                })
                .catch(() => {
                    res.json({
                        success: false,
                        message: "Internal server error"
                    })
                });
        })
    }
   // return res.redirect('/login');
}