const create = require('../../../../../../functions/plugins/sam/loyalty/create');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('plugins/sam/loyalty/create', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
};

module.exports.post = async (req, res) => {
    try {
        const { asset_name, asset_quantity, asset_open, asset_unit, asset_description } = req.body;

        let response = await create(req.user.primechain_address, req.user.primechain_address, asset_name, asset_quantity, asset_unit, asset_open, asset_description);

        if (response.status === 200) {
            return res.json({
                success: true,
                asset_name: response.msg.name,
                asset_quantity: response.msg.quantity,
                asset_open: asset_open,
                asset_unit: response.msg.unit,
                asset_description: response.msg.description,
                asset_ref: response.msg.asset_ref,
                txid: response.msg.txid
            });
        }
        else {
            return res.json({
                "success": false,
                "message": response.message
            });
        }
    } catch (error) {
        return res.json({
            "success": false,
            "message": error.message
        });
    }
};