const multer = require('multer');
const path = require('path');
const primeqr = require('../../../../models/plugins/primemason/primeqr');

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


module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const data = await primeqr.findOne({ uuid: req.query.uuid });

            return res.render('plugins/primemason/primeqr/update', {
                dataArr: data.json,
                uuid: data.uuid
            });
        } catch (error) {
            return res.render('plugins/primemason/primeqr/update');
        }
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            Uploads(req, res, async (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                }

                let original_data = await primeqr.findOne({ uuid: req.body.uuid });

                let json = req.body;
                let uuid = req.body.uuid;
                json['image'] = (req.files.length > 0) ? req.files[0].path : original_data.json['image'];

                delete json['uuid'];

                await primeqr.findOneAndUpdate({ uuid }, { json });

                req.flash("success_msg", "Input updated. ", uuid);
                return res.redirect('/plugins/primemason/primeqr/manage');
            })
        }
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/primeqr/manage');
    }
}