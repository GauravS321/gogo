const bankguarantee = require('../../../../models/plugins/dave/bank-guarantee');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const records_list = [];
            const records = await bankguarantee.find();

            records.forEach(record => {
                records_list.push({
                    name: record.keys[0],
                    date_issue: record.keys[1],
                    currency: record.keys[2],
                    amount_in_figures: record.keys[3],
                    beneficiary: record.keys[4],
                    tx_id_enc_data: record.tx_id_enc_data,
                    tx_id_signature: record.tx_id_signature,
                    aes_password: record.aes_password,
                    aes_iv: record.aes_iv,
                    trade_channel_name: record.trade_channel_name
                });
            });

            return res.render('plugins/dave/bank-guarantee/view', {
                dataArr: records_list,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/dave/bank-guarantee/view', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login')
}