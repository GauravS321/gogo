// Electronic signatures
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('components/esignature/create-save', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
}
