const blockchainParameters = require('../../../../../../functions/components/blockchain/parameters');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await blockchainParameters();

            return res.render('components/blockchain/parameters', {
                blockchain_parameters: response.msg,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('components/blockchain/parameters');
        }
    }
    return res.redirect('/login');
}