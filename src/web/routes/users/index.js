const router = require('express').Router();
const passport = require('passport');

// LogIn controller
const loginController = require('../../controllers/users/login');

// SignUp controller
const signupController = require('../../controllers/users/signup');

// Lost-password controller
const lostPasswordController = require('../../controllers/users/lost-password');

// Reset-password controller
const resetPasswordController = require('../../controllers/users/reset-password');

// User profile controller
const profileController = require('../../controllers/users/account/profile');

// User activity-logs controller
const activityLogsContoller = require('../../controllers/users/account/activity-logs');

// My assets transfer controller
const myAssetsTransferController = require('../../controllers/users/account/myassets/transfer');

// My assets send controller
const myAssetsSendController = require('../../controllers/users/account/myassets/send');

// User change-password controller
const changePasswordContoller = require('../../controllers/users/account/change-password');

// User logout controller
const logoutContoller = require('../../controllers/users/account/logout');

/* Routing for users login. */
router.get('/login', loginController.get);
router.post('/login', loginController.post);

/* Routing for users signup. */
router.get('/signup', signupController.get);
router.post('/signup', signupController.post);

/* Routing for users lost-password. */
router.get('/lost-password', lostPasswordController.get);
router.post('/lost-password', lostPasswordController.post);

/* Routing for users reset-password. */
router.get('/reset-password', resetPasswordController.get);
router.post('/reset-password', resetPasswordController.post);

/* Routing for user profile. */
router.get('/account/my-profile', profileController.get);

// Router get user account activity logs
router.get('/account/activity-logs', activityLogsContoller.get);

// Router user account change password
router.get('/account/change-password', changePasswordContoller.get);
router.post('/account/change-password', changePasswordContoller.post);

// My assets - transfer asset
router.get('/account/myassets/transfer', myAssetsTransferController.get);
router.get('/account/myassets/transfer/:name', myAssetsSendController.get);
router.post('/account/myassets/send', myAssetsSendController.post);

// User logout
router.get('/account/logout', logoutContoller.get);

/**
 * OAuth authentication routes. (Sign in)
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline', prompt: 'consent' }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {    
 return res.redirect('/account/my-profile');
});

module.exports = router;