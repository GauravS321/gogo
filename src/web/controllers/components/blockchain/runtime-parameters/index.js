const runtimeParameters = require('../../../../../../functions/components/blockchain/runtime-parameters');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const response = await runtimeParameters();

            return res.render('components/blockchain/runtime-parameters', {
                runtime_parameters: response.msg
            });
        } catch (error) {
            return res.render('components/blockchain/runtime-parameters');
        }
    }
    return res.redirect('/login');
}