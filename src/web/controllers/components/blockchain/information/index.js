const blockchainInformation = require('../../../../../../functions/components/blockchain/information');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const response = await blockchainInformation();

            return res.render('components/blockchain/information', {
                blockchain_information: response.msg,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('components/blockchain/information', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
}