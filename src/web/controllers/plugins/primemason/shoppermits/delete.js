const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            await shoppermits.deleteOne({uuid: req.body.uuid});

            req.flash('success_msg', 'Record deleted of the uuid:' + req.body.uuid);
            return res.redirect('/plugins/primemason/shoppermits/manage-shops')
        } catch (error) {
            req.flash('error_msg', "Oops, something went wrong!!");
            return res.redirect('/plugins/primemason/shoppermits/manage-shops');
        }
    }
}