const { retrieve } = require('../../../../../../functions/plugins/dave/academic');

module.exports.get = async (req, res) => {
    try {
        let response = await retrieve(req.query);

        console.log(response);

        return res.render('plugins/dave/academic/verification', {
            data: response.msg['data'],
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/dave/academic/verification', {
            error_msg: "Whoops, something went wrong, Please try later..",
            username: req.user.username,
            email: req.user.email
        });
    }
}