const { share } = require('../../../../../../functions/plugins/dave/academic');

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { txid_data, txid_signature, password, iv, trade_channel_name, receiver_name, receiver_email } = req.body;

            if (txid_data && txid_signature && password && iv && trade_channel_name && receiver_name && receiver_email) {
                const body = {
                    txid_data,
                    txid_signature,
                    password,
                    iv,
                    trade_channel_name,
                }

                await share(req.user.email, receiver_name, receiver_email, body);

                req.flash("success_msg", "Document link e-mail sent successfully!!!")
                return res.redirect('/plugins/dave/academic/view');
            }
            else {
                req.flash("error_msg", "Missing inputs");
                return res.redirect('/plugins/dave/academic/view');
            }
        } catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect('/plugins/dave/academic/view');
        }
    }
    return res.redirect('/login')
}