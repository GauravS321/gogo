const indkyc = require('../../../../models/plugins/dave/indkyc');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const records_list = [];
            const records = await indkyc.find();

            records.forEach(record => {
                records_list.push({
                    primechainaddress: record.keys[0],
                    fullname: record.keys[1],
                    dob: record.keys[2],
                    father: record.keys[3],
                    mobile: record.keys[4],
                    tx_id_enc_data: record.tx_id_enc_data,
                    tx_id_signature: record.tx_id_signature,
                    aes_password: record.aes_password,
                    aes_iv: record.aes_iv,
                    trade_channel_name: record.trade_channel_name
                });
            });
            console.log(records_list);
            return res.render('plugins/dave/indkyc/view', {
                dataArr: records_list,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/dave/indkyc/view', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login');
}