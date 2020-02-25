const { read } = require('../../../../../functions/components/wizard');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let wizard_data = [];

            let data = await read();

            data.msg.forEach(ele => {
                wizard_data.push({
                    'id': ele['_id'],
                    'value1': [ele.json[Object.keys(ele.json)[0]]][0],
                    'value2': [ele.json[Object.keys(ele.json)[1]]][0],
                    'value3': [ele.json[Object.keys(ele.json)[2]]][0],
                })
            });

            return res.render('components/wizard/list', {
                dataArr: wizard_data,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('components/wizard/list', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
}
