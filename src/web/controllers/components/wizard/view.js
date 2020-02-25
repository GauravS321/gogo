const { getById } = require('../../../../../functions/components/wizard');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const dataArr = [];
            const data = await getById(req.params.id);

            Object.keys(data.msg.json).map((_key) => {
                let displayName = _key.toLowerCase().split('_').map((word) => {
                    return (word.charAt(0).toUpperCase() + word.slice(1));
                }).join(' ');

                dataArr.push({ key: _key, displayName: displayName, value: data.msg.json[_key] });
            });

            return res.render('components/wizard/view', {
                dataArr,
                id: data.msg['_id']
            });
        } catch (error) {
            return res.render('components/wizard/view');
        }
    }
    return res.redirect('/login');
}