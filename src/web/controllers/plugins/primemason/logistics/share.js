const { share } = require('../../../../../../functions/plugins/primemason/logistics');

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let use_case = req.baseUrl.split('/')[3];
            const {receiver_name, receiver_email, uuid} = req.body;
            
            await share(req.user.email, receiver_name, receiver_email, uuid, use_case);

            req.flash("success_msg", "Logistics detail e-mail sent successfully!!!")
            return res.redirect('/plugins/primemason/logistics/manage');
        } catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect('/plugins/primemason/logistics/manage');
        }
    }
    return res.redirect('/login');
}