const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const uuid = req.query.uuid;
            const record = await shoppermits.findOne({ uuid });

            return res.render('plugins/primemason/shoppermits/view', {
                dataArr: record.json
            });
        } catch (error) {
            return res.render('plugins/primemason/shoppermits/view');
        }
    }
    return res.redirect('/login');
}