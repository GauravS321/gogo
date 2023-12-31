const primeqr = require('../../../../models/plugins/primemason/primeqr');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const records_list = [];
            const records = await primeqr.find();

            records.forEach(record => {
                records_list.push({
                    documentId: record.document_id,
                    uuid: record.uuid,
                    "ProductName": record.json["Product Name"]
                });
            });

            return res.render('plugins/primemason/primeqr/manage', {
                dataArr: records_list,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('plugins/primemason/primeqr/manage', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
}