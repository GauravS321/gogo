const academic = require('../../../../models/plugins/dave/academic');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const records_list = [];
            const records = await academic.find();

            records.forEach(record => {
                records_list.push({
                    fullname: record.keys[0],
                    dob: record.keys[1],
                    father: record.keys[2],
                    mother: record.keys[3],
                    mobile: record.keys[4],
                    tx_id_enc_data: record.tx_id_enc_data,
                    tx_id_signature: record.tx_id_signature,
                    aes_password: record.aes_password,
                    aes_iv: record.aes_iv,
                    trade_channel_name: record.trade_channel_name
                });
            });

            return res.render('plugins/dave/academic/view', {
                dataArr: records_list,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/dave/academic/view', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login')
}