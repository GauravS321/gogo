const read = require('../../../../../functions/components/data-channels/read');

module.exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let streamArr = [];
            const response = await read();

            response.msg.forEach(stream => {
                streamArr.push({
                    name: stream.name,
                    open: (stream.restrict.write) ? "false" : "true"
                });
            });

            return res.render('components/data-channels/list', {
                streamArr,
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        } catch (error) {
            return res.render('components/data-channels/list', {
                username: (req.user) ? req.user.username : "",
                email: (req.user) ? req.user.email : "",
            });
        }
    }
    return res.redirect('/login');
}