const verifySaved = require('../../../../../functions/components/esignature/verify-save')

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/esignature/verify-save', {
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
    res.redirect('/login');
};

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { data } = req.body;
            const response = await verifySaved(data);

            return res.json({
                success: true,
                signer_address: response.msg.signer_address,
                signature: response.msg.signature,
                timestamp: response.msg.timestamp,

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