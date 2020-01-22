const runtimeParameters = require('../../../../../../functions/components/blockchain/runtime-parameters');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await runtimeParameters();

            return res.render('components/blockchain/runtime-parameters', {
                runtime_parameters: response.msg,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('components/blockchain/runtime-parameters', {
                username: req.user.username,
                email: req.user.email,
            });
        }
    }
    return res.redirect('/login');
}