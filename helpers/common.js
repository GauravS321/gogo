const _ = require('lodash');
const randomString = require('randomstring');

exports.generateRandomString = async (size) => {
    try {
        return randomString.generate(size);
    } catch (error) {
        throw Error('Unable to generate random string')
    }
}

const routesSecurity = [
    {
        route: '/plugins/dave/indkyc/issue',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/dave/indkyc/view',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/dave/bank-guarantee/issue',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/dave/bank-guarantee/view',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/sam/p2p/create',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/sam/p2p/create-more',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/sam/invoice/create',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/sam/loyalty/create',
        access: ['admin', 'employee']
    },
    {
        route: '/plugins/sam/loyalty/create-more',
        access: ['admin', 'employee']
    },
    {
        route: '/components/blockchain/parameters',
        access: ['admin']
    },
    {
        route: '/components/blockchain/information',
        access: ['admin']
    },
    {
        route: '/components/blockchain/runtime-parameters',
        access: ['admin']
    },
    {
        route: '/components/blockchain/peer-info',
        access: ['admin']
    },
    {
        route: '/components/data-channels/create',
        access: ['admin']
    },
    {
        route: '/components/data-channels/list',
        access: ['admin']
    },
    {
        route: '/components/data-channels/grant',
        access: ['admin']
    },
    {
        route: '/components/data-channels/revoke',
        access: ['admin']
    },
    {
        route: '/components/user-management/list',
        access: ['admin']
    },
    {
        route: '/components/permissions/manage',
        access: ['admin']
    },
    {
        route: '/components/esignature/create',
        access: ['admin']
    },
    {
        route: '/components/esignature/verify',
        access: ['admin']
    },
    {
        route: '/components/esignature/create-save',
        access: ['admin']
    },
    {
        route: '/components/data/publish',
        access: ['admin']
    },
    {
        route: '/components/data/download',
        access: ['admin']
    },
    {
        route: '/components/data/publish-encrypt',
        access: ['admin']
    },
    {
        route: '/components/data/download-decrypt',
        access: ['admin']
    },
    {
        route: '/components/file/publish-encrypt',
        access: ['admin']
    },
    {
        route: '/components/file/download-decrypt',
        access: ['admin']
    }
];

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
    if (routeSecurity && req.user) {
        let count = 0;
        
        for (let i = 0; i < routeSecurity.access.length; i++) {
            if (req.user.role === routeSecurity.access[i]) {
                count++;
            }
        }

        if (count === 1) {
            return next();
        }
        else {
            req.flash('error_msg', 'Access restricted');
            return res.redirect('/login');
        }
    } else {
        req.flash('error_msg', 'Access restricted');
        return res.redirect('/login');
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
