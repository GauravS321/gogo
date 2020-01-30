const shoppermits = require('../../../../models/plugins/primemason/shoppermits');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            console.log(req.params);
            console.log(req.query)
            const uuid = req.params.uuid;
            
            const record = await shoppermits.findOne({uuid});

            return res.render('plugins/primemason/shoppermits/view', {
                dataArr: record,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/shoppermits/view', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login');
}