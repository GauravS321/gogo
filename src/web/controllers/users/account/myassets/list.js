const listOffers = require('../../../../../../functions/users/account/myassets/list-offers');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await listOffers(req.user.primechain_address);

            return res.render('users/account/list_public_offers', {
                assets: response.msg,
                primechain_address: req.user.primechain_address
            });
        } catch (error) {
            return res.render('users/account/list_public_offers', {
                primechain_address: req.user.primechain_address
            });
        }

    }
    // return res.redirect('/login');
}