const Sam = require('../../../models/components/sam');
const createMore = require('../../../../../functions/components/sam/createMore');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const create_more_asset_list = [];
            let responseArr = await Sam.find({ issuer: req.user.primechain_address });

            responseArr.forEach(asset => {
                if (asset['open'] === true) {
                    create_more_asset_list.push({
                        name: asset.name,
                        reference: asset.reference
                    });
                }
            });

            return res.render('components/sam/view-create-more', {
                create_more_asset_list,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('components/sam/view-create-more', {
                username: req.user.username,
                email: req.user.email,
            });
        }

    }
    return res.redirect('/login');
};

module.exports.getByAssetReference = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { reference } = req.params;

            return res.render('components/sam/create-more', {
                reference,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('components/sam/create-more', {
                username: req.user.username,
                email: req.user.email,
            });
        }

    }
    return res.redirect('/login');
};

module.exports.post = async (req, res) => {
    try {
        const { asset_name, asset_quantity } = req.body;

        let response = await createMore(req.user.primechain_address, req.user.primechain_address, asset_name, asset_quantity);

        if (response.status === 200) {
            req.flash("success_msg", "Created more assets, TX ID: " + response.msg);
            return res.redirect('/components/sam/create-more');
        }
        else {
            req.flash("error_msg", response.message);
            return res.redirect('/components/sam/create-more');
        }
    } catch (error) {
        req.flash("error_msg", error.message);
        return res.redirect('/components/sam/create-more');
    }
};