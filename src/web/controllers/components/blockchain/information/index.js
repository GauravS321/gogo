const blockchainInformation = require('../../../../../../functions/components/blockchain/information');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const response = await blockchainInformation();

            return res.render('components/blockchain/information', {
                blockchain_information: response.msg
            });
        } catch (error) {
            return res.render('components/blockchain/information');
        }
    }
    return res.redirect('/login');
}