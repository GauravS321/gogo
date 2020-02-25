const createMore = require('../../../../../../functions/plugins/sam/invoice/create-more');
const Invoice = require('../../../../models/plugins/sam/invoice');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const create_more_asset_list = [];
            const responseArr = await Invoice.find({ issuer: req.user.primechain_address });

            responseArr.forEach(asset => {
                if (asset['open'] === true) {
                    create_more_asset_list.push({
                        name: asset.name,
                        reference: asset.reference
                    });
                }
            });

            return res.render('plugins/sam/invoice/view-create-more', {
                create_more_asset_list
            });
        } catch (error) {
            return res.render('plugins/sam/invoice/view-create-more');
        }
    }
    return res.redirect('/login');
};

module.exports.getByAssetReference = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { reference } = req.params;

            return res.render('plugins/sam/invoice/create-more', {
                reference
            });
        } catch (error) {
            return res.render('plugins/sam/invoice/create-more');
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
            return res.redirect('/plugins/sam/invoice/create-more');
        }
        else {
            req.flash("error_msg", response.message);
            return res.redirect('/plugins/sam/invoice/create-more');
        }
    } catch (error) {
        req.flash("error_msg", error.message);
        return res.redirect('/plugins/sam/invoice/create-more');
    }
};