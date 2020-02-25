const createMore = require('../../../../../../functions/plugins/sam/loyalty/create-more');
const Loyalty = require('../../../../models/plugins/sam/loyalty');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const create_more_asset_list = [];
            const responseArr = await Loyalty.find({ issuer: req.user.primechain_address });

            responseArr.forEach(asset => {
                if (asset['open'] === true) {
                    create_more_asset_list.push({
                        name: asset.name,
                        reference: asset.reference
                    });
                }
            });

            return res.render('plugins/sam/loyalty/view-create-more', {
                create_more_asset_list,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('plugins/sam/loyalty/view-create-more', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
};

module.exports.getByAssetReference = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { reference } = req.params;

            return res.render('plugins/sam/loyalty/create-more', {
                reference,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('plugins/sam/loyalty/create-more', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
};

module.exports.post = async (req, res) => {
    try {
        const { asset_name, asset_quantity } = req.body;
        const response = await createMore(req.user.primechain_address, req.user.primechain_address, asset_name, asset_quantity);

        if (response.status === 200) {
            req.flash("success_msg", "Created additional units");
            return res.redirect('/plugins/sam/loyalty/create-more');
        }
        else {
            req.flash("error_msg", response.message);
            return res.redirect('/plugins/sam/loyalty/create-more');
        }
    } catch (error) {
        req.flash("error_msg", error.message);
        return res.redirect('/plugins/sam/loyalty/create-more');
    }
};