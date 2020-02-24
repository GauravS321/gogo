const { share } = require('../../../../../../functions/plugins/dave/bank-guarantee');

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let use_case = req.baseUrl.split('/')[3];
            const { txid_data, txid_signature, password, iv, trade_channel_name, receiver_name, receiver_email } = req.body;

            if (txid_data && txid_signature && password && iv && trade_channel_name && receiver_name && receiver_email) {
                const body = {
                    txid_data,
                    txid_signature,
                    password,
                    iv,
                    trade_channel_name,
                }

                await share(req.user.email, receiver_name, receiver_email, body, use_case);

                req.flash("success_msg", "Email sent successfully")
                return res.redirect('/plugins/dave/bank-guarantee/view');
            }
            else {
                req.flash("error_msg", "Missing inputs");
                return res.redirect('/plugins/dave/bank-guarantee/view');
            }
        } catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect('/plugins/dave/bank-guarantee/view');
        }
    }
    return res.redirect('/login')
}