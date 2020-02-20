const multer = require('multer');
const path = require('path');
const primeqr = require('../../../../models/plugins/primemason/primeqr');
const moment = require('moment');

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

module.exports.post = async (req, res) => {
    try {
        Uploads(req, res, async (err) => {
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            }

            let uuid = req.body.uuid;
            let json = req.body;
            json['custom_image'] = (req.files.length > 0)? req.files[0].path: "";

            delete json['uuid'];
            json['Date'] = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a');
            json['Full name'] = (req.user) ? req.user.username : 'NA';
            json['Email'] = (req.user) ? req.user.email : 'NA';

            await primeqr.findOneAndUpdate({ uuid }, { $push: { inputs: json } });
            const record = await primeqr.findOne({ uuid });
            return res.render('plugins/primemason/primeqr/view-inputs', {
                uuid,
                data: true,
                dataArr: record.json,
                inputsArr: record.inputs,
                username: (req.user) ? req.user.username : false,
                email: (req.user) ? req.user.email : false
            });
        })
    } catch (error) {
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/primeqr/manage');
    }
}