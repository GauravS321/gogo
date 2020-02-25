const create = require('../../../../../functions/components/esignature/create')

// Electronic signatures
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/esignature/create', {
            username: (req.user) ? req.user.username : "",
            email: (req.user) ? req.user.email : "",
        });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { data } = req.body;
            const myURL = (req.headers.referer).split('/')[5];
            const response = await create(req.user.primechain_address, data, myURL);

            if (!response.msg.tx_id) {
                return res.json({
                    success: true,
                    signature: response.msg.signature
                });
            }
            else {
                return res.json({
                    success: true,
                    signature: response.msg.signature,
                    txid: response.msg.tx_id
                });
            }
        } catch (error) {
            return res.json({
                success: false,
                message: error.error
            });
        }
    }
    return res.redirect('/login');
};
