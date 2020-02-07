const router = require('express').Router();

//Controller
// Issue
const issueController = require('../../../../controllers/plugins/dave/indkyc/issue');

// View
const viewController = require('../../../../controllers/plugins/dave/indkyc/view');

// Share
const shareController = require('../../../../controllers/plugins/dave/indkyc/share');

// Verification
const verifyController = require('../../../../controllers/plugins/dave/indkyc/verify');

/* Routing for issue */
router.get('/issue', issueController.get);
router.post('/issue', issueController.post);

/** Routing for view */
router.get('/view', viewController.get);

/** Routing for share */
router.post('/share', shareController.post);

/** Routing for verfication */
router.get('/verification', verifyController.get);

/** Routing for qrcode */
router.get('/qrcode', verifyController.getQRCode);

module.exports = router;