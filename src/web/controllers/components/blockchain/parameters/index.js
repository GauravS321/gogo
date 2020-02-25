const blockchainParameters = require('../../../../../../functions/components/blockchain/parameters');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const response = await blockchainParameters();

            return res.render('components/blockchain/parameters', {
                blockchain_parameters: response.msg,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('components/blockchain/parameters', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
}