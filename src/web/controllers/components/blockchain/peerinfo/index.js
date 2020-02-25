const peerinfo = require('../../../../../../functions/components/blockchain/peerinfo');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const response = await peerinfo();

            return res.render('components/blockchain/peerinfo', {
                peerinfo: response.msg,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('components/blockchain/peerinfo', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
}