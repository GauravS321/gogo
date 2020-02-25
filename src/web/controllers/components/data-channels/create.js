const create = require('../../../../../functions/components/data-channels/create');

// Data Channels
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data-channels/create');
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { trade_channel_name, details, open } = req.body;
            const response = await create(req.user.primechain_address, trade_channel_name, details, open);

            return res.json({
                success: true,
                transaction_id: response.msg,
                trade_channel_name
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
}