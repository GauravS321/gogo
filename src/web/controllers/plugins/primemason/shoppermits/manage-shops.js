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
                dataArr: records_list
            });
        } catch (error) {
            return res.render('plugins/primemason/shoppermits/manage-shops');
        }
    }
    return res.redirect('/login');
}