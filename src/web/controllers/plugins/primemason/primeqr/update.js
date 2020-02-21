const primeqr = require('../../../../models/plugins/primemason/primeqr');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let data = await primeqr.findOne({ uuid: req.query.uuid });

            return res.render('plugins/primemason/primeqr/update', {
                dataArr: data.json,
                uuid: data.uuid,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/primeqr/update', {
                username: req.user.username,
                email: req.user.email
            });
        }

    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            console.log(req.body);
            let json = req.body;
            let uuid = req.body.uuid;
            console.log(uuid)
            delete json['uuid'];

           await primeqr.findOneAndUpdate({ uuid }, { json });

            req.flash("success_msg", "Input updated. ", uuid);
            return res.redirect('/plugins/primemason/primeqr/manage');
        }
    } catch (error) {
        console.log(error);
        req.flash('error_msg', "Oops. Something went wrong.");
        return res.redirect('/plugins/primemason/primeqr/manage');
    }
}