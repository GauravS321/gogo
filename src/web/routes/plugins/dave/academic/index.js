const router = require('express').Router();

//Controller
// Issue
const bgIssueController = require('../../../../controllers/plugins/dave/academic/issue');

// View
const bgViewController = require('../../../../controllers/plugins/dave/academic/view');

// Share
const bgShareController = require('../../../../controllers/plugins/dave/academic/share');

// Verification
const bgVerifyController = require('../../../../controllers/plugins/dave/academic/verify');

// Routes
router.get('/issue', bgIssueController.get);
router.post('/issue', bgIssueController.post);

router.get('/view', bgViewController.get);
router.post('/share', bgShareController.post);

router.get('/verification', bgVerifyController.get);

module.exports = router;