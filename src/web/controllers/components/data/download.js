const download = require('../../../../../functions/components/data/download');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/data/download');
    }
    return res.redirect('/login');
}

exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let data = [];
            const { key, stream_name } = req.body;

            let responseArr = await download(key, stream_name);

            responseArr.msg.forEach(response => {
                data.push({
                    [response.key]: response.data
                });
            });

            return res.render('components/data/view-download-data', {
                dataArr: data
            });

        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/components/data/download');
            }
            else if (error.error) {
                req.flash('error_msg', error.error);
                return res.redirect('/components/data/download');
            }
            else {
                req.flash('error_msg', "Internal server error!!!");
                return res.redirect('/components/data/download');
            }
        }
    }
    return res.redirect('/login');
}