const peerinfo = require('../../../../../../functions/components/blockchain/peerinfo');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const response = await peerinfo();

            return res.render('components/blockchain/peerinfo', {
                peerinfo: response.msg
            });
        } catch (error) {
            return res.render('components/blockchain/peerinfo');
        }
    }
    return res.redirect('/login');
}