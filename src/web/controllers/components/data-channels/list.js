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
                streamArr
            });
        } catch (error) {
            return res.render('components/data-channels/list');
        }
    }
    return res.redirect('/login');
}