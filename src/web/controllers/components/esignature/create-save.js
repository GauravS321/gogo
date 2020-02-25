// Electronic signatures
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/esignature/create-save');
    }
    return res.redirect('/login');
}
