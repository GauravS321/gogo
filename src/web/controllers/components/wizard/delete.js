const { deleteData } = require('../../../../../functions/components/wizard');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            await deleteData(req.params.id);

            req.flash('success_msg', 'Record deleted of the id:' + req.params.id);
            return res.redirect('/components/wizard/list')
        } catch (error) {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/components/wizard/list');
        }
    }
}