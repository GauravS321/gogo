const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const records_list = [];
            const records = await shoppermits.find();

            records.forEach(record => {
                records_list.push({
                    uuid: record.uuid,
                    "ShopName": record.json["Shop Name"]
                });
            });

            return res.render('plugins/primemason/shoppermits/manage-shops', {
                dataArr: records_list,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('plugins/primemason/shoppermits/manage-shops', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
}