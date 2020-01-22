const send = require('.././../../../../functions/components/sam/send')
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/sam/send',
            {
                asset_name: req.params.name,
                username: req.user.username,
                email: req.user.email,
            });
    }
    return res.redirect('/login');
}

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { receiver_address, asset_name, quantity, description } = req.body;

            let response = await send(req.user.primechain_address, receiver_address, asset_name, quantity, description);

            if (response.status === 200) {
                req.flash('success_msg', "Asset successfully sent!!" + response.msg)
                return res.redirect('/components/sam/transfer')
            }
        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/components/sam/transfer');
            }
            else if (error.error) {
                req.flash('error_msg', error.error);
                return res.redirect('/components/sam/transfer');
            }
            else {
                req.flash('error_msg', "Internal server error!!!");
                return res.redirect('/components/sam/transfer');
            }
        }
    }
    return res.redirect('/login')
}

