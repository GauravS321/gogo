const { retrieve } = require('../../../../../../functions/plugins/dave/bank-guarantee');

module.exports.get = async (req, res) => {
    try {
        let response = await retrieve(req.query);

        return res.render('plugins/dave/bank-guarantee/verification', {
            data: response.msg['data'],
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    } catch (error) {
        return res.render('plugins/dave/bank-guarantee/verification', {
            error_msg: error.error,
            username: (req.user) ? req.user.username : false,
            email: (req.user) ? req.user.email : false
        });
    }
}