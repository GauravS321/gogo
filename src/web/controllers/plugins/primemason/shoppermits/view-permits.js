const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = async (req, res) => {
        try {
            const uuid = req.query.uuid;
            
            const record = await shoppermits.findOne({uuid});

            return res.render('plugins/primemason/shoppermits/view-permits', {
                shopname: record.json['Shop Name'],
                ownername: record.json['Owner Name'],
                dataArr: record.permits,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/shoppermits/view-permits', {
                username: req.user.username,
                email: req.user.email
            });
        }
}