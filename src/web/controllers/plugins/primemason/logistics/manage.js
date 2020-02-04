const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const records_list = [];
            const records = await logistics.find();

            records.forEach(record => {
                records_list.push({
                    uuid: record.uuid,
                    "ProductName": record.json["Product Name"]
                });
            });

            return res.render('plugins/primemason/logistics/manage', {
                dataArr: records_list,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/logistics/manage', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login');
}