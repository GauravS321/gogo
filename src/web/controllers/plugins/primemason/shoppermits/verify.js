const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = async (req, res) => {
    try {
          const record = await shoppermits.findOne({req.query.uuid});

            return res.render('plugins/primemason/shoppermits/view', {
                dataArr: record.json,
                username: req.user.username,
                email: req.user.email
            });
    } catch (error) {
        rreturn res.render('plugins/primemason/shoppermits/view', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}

module.exports.getQRCode = async (req, res) => {
    try {
        const uuid= req.query.uuid;

        return res.render('plugins/primemason/shoppermits/qrcode', {
            data: `${uuid}`,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/primemason/shoppermits/qrcode', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}