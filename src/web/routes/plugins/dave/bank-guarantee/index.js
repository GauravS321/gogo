const router = require('express').Router();

//Controller
// Issue
const issueController = require('../../../../controllers/plugins/dave/bank-guarantee/issue');

// View
const viewController = require('../../../../controllers/plugins/dave/bank-guarantee/view');

// Share
const shareController = require('../../../../controllers/plugins/dave/bank-guarantee/share');

// Verification
const verifyController = require('../../../../controllers/plugins/dave/bank-guarantee/verify');

/** Routing for issue */
router.get('/issue', issueController.get);
router.post('/issue', issueController.post);

/** Routing for view */
router.get('/view', viewController.get);

/** Routing for share */
router.post('/share', shareController.post);

/** Routing for verification */
router.get('/verification', verifyController.get);

module.exports = router;