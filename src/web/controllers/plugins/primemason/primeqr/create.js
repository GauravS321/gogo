const multer = require('multer');
const path = require('path');
const { create } = require('../../../../../../functions/plugins/primemason/primeqr');

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
        return res.render('plugins/primemason/primeqr/create', {
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
    return res.redirect('/login');
}

module.exports.post = (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            Uploads(req, res, async (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                }

                let json = req.body;
                json['image'] = (req.files.length > 0) ? req.files[0].path : "";
                const response = await create(req.body);

                req.flash("success_msg", "PrimeQR created. ", response.msg['uuid']);
                return res.redirect('/plugins/primemason/primeqr/create');
            })
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/primeqr/create');
    }
}