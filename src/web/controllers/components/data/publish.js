const publishPlainData = require('../../../../../functions/components/data/publish');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data/publish', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
};

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { key, data, stream_name } = req.body;

            let response = await publishPlainData(req.user.primechain_address, data, stream_name, key);

            return res.json({
                success: true,
                transaction_id: response.msg,
                key,
                stream_name
            });

        } catch (error) {
            return res.json({
                success: false
            });
        }
    }
    return res.redirect('/login');
}