const _ = require('lodash');
const randomString = require('randomstring');

exports.generateRandomString = async (size) => {
    try {
        return randomString.generate(size);
    } catch (error) {
        throw Error('Unable to generate random string')
    }
}

const routesSecurity = [{
    route: '/account/*',
    access: 1
},
{
    route: '/components/*',
    access: 1
},
{
    route: '/plugins/dave/*',
    access: 1
},
{
    route: '/plugins/primemason',
    access: 1
},
{
    route: '/plugins/sam',
    access: 1
}];

module.exports.checkAccess = (req, res, next) => {
    const routeSecurity = _.find(routesSecurity, {
        'route': req.originalUrl
    });

    //const secureLevel = Math.pow(2, req.user.roleId - 1);
    // If the user is not an admin and route is restricted, show message and redirect to /admin
    // if (routeSecurity && (routeSecurity.access & secureLevel) === secureLevel) {
    //     next();
    // } else {
    //     req.flash('error_msg', 'Page not found');
    //     res.redirect('/invoice/dashboard');
    // }
    if (routeSecurity && req.user.role == admin) {
        next();
    } else {
        req.flash('error_msg', 'Access restricted');
        res.redirect('/login');
    }
}

exports.isAdmin = (req, res, next, role) => {
    if (req.user.role === role) {
        next();
    }
    else {
        res.redirect('/login');
    }
}
