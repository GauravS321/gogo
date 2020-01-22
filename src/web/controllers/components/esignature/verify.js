const verify = require('../../../../../functions/components/esignature/verify')

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/esignature/verify', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/login');
};

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { data, signature } = req.body;
            const response = await verify(req.user.primechain_address, data, signature);

            return res.json({
                success: true,
                signature: response.msg
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
    return res.redirect('/login');
};