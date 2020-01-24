const router = require('express').Router();

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
router.get('/issue', issueController.get);
router.post('/issue', issueController.post);

/** Routing for view */
router.get('/view', viewController.get);

/** Routing for share */
router.post('/share', shareController.post);

/** Routing for verfication */
router.get('/verification', verifyController.get);

module.exports = router;