const multer = require('multer');
const path = require('path');
const { create } = require('../../../../../../functions/plugins/primemason/logistics');

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
        return res.render('plugins/primemason/logistics/create');
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
                json['image'] = (req.files) ? req.files[0].path : "";
                let response = await create(req.body);

                req.flash("success_msg", "LR created. ", response.msg['uuid']);
                return res.redirect('/plugins/primemason/logistics/create');
            })
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/logistics/create');
    }
}