const router = require('express').Router();

const { checkAccess } = require('../../../../../../helpers/common');

//Controller
// Issue
const issueController = require('../../../../controllers/plugins/dave/academic/issue');

// View
const viewController = require('../../../../controllers/plugins/dave/academic/view');

// Share
const shareController = require('../../../../controllers/plugins/dave/academic/share');

// Verification
const verifyController = require('../../../../controllers/plugins/dave/academic/verify');

/* Routing for issue */
router.get('/issue', checkAccess, issueController.get);
router.post('/issue', checkAccess, issueController.post);

/** Routing for view */
router.get('/view', checkAccess, viewController.get);

/** Routing for share */
router.post('/share', checkAccess, shareController.post);

/** Routing for verfication */
router.get('/verification', verifyController.get);

/** Routing for qrcode */
router.get('/qrcode', verifyController.getQRCode);

module.exports = router;