const logistics = require('../../../../models/plugins/primemason/logistics');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const uuid = req.query.uuid;
            
            const record = await logistics.findOne({uuid});

            return res.render('plugins/primemason/logistics/view', {
                dataArr: record.json,
                inputsArr: record.json,
                uuid: req.query.uuid,
                username: req.user.username,
                email: req.user.email
            });
        } catch (error) {
            return res.render('plugins/primemason/logistics/view', {
                username: req.user.username,
                email: req.user.email
            });
        }
    }
    return res.redirect('/login');
}