const { share } = require('../../../../../../functions/plugins/primemason/primeqr');

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let use_case = req.baseUrl.split('/')[3];
            const {receiver_name, receiver_email, uuid} = req.body;
            
            await share(req.user.email, receiver_name, receiver_email, uuid, use_case);

            req.flash("success_msg", "PrimeQR details e-mail sent successfully!!!")
            return res.redirect('/plugins/primemason/primeqr/manage');
        } catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect('/plugins/primemason/primeqr/manage');
        }
    }
    return res.redirect('/login');
}