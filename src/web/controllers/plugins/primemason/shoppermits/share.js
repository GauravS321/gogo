const { share } = require('../../../../../../functions/plugins/primemason/shoppermits');

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let use_case = req.baseUrl.split('/')[3];
            const {receiver_name, receiver_email, uuid} = req.body;
            
            await share(req.user.email, receiver_name, receiver_email, uuid, use_case);

            req.flash("success_msg", "Permits detail e-mail sent successfully!!!")
            return res.redirect('/plugins/primemason/shoppermits/manage-shops');
        } catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect('/plugins/primemason/shoppermits/manage-shops');
        }
    }
    return res.redirect('/login');
}