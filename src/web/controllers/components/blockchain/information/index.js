const blockchainInformation = require('../../../../../../functions/components/blockchain/information');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await blockchainInformation();

        return res.render('components/blockchain/information', {
            blockchain_information: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}