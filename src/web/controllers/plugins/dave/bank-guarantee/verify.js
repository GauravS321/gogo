const { retrieve } = require('../../../../../../functions/plugins/dave/bank-guarantee');

module.exports.get = async (req, res) => {
    try {
        let response = await retrieve(req.query);

        console.log(response);

        return res.render('plugins/dave/bank-guarantee/verification', {
            data: response.msg['data'],
            username: req.user.username,
            email: req.user.email
        });
    } catch (error) {
        return res.render('plugins/dave/bank-guarantee/verification', {
            error_msg: "Whoops, something went wrong, Please try later..",
            username: req.user.username,
            email: req.user.email
        });
    }
}