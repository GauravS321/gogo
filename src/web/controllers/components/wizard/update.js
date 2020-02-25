const { getById, updateData } = require('../../../../../functions/components/wizard');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const data = await getById(req.params.id);

            return res.render('components/wizard/edit', {
                dataArr: data.msg.json,
                id: data.msg['_id']
            });
        } catch (error) {
            return res.render('components/wizard/edit');
        }
    }
    return res.redirect('/login');
}

exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const response = await updateData(req.body);

            req.flash('success_msg', response.msg);
            return res.redirect('/components/wizard/list');

        } catch (error) {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/components/wizard/list');
        }
    }
}