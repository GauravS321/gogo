const router = require('express').Router();

//Controller
// Issue
const bgIssueController = require('../../controllers/plugins/dave/bank-guarantee/issue');

// View
const bgViewController = require('../../controllers/plugins/dave/bank-guarantee/view');

// Share
const bgShareController = require('../../controllers/plugins/dave/bank-guarantee/share');

// Verification
const bgVerifyController = require('../../controllers/plugins/dave/bank-guarantee/verify');

// Routes
router.get('/issue', bgIssueController.get);
router.post('/issue', bgIssueController.post);

router.get('/view', bgViewController.get);
router.post('/share', bgShareController.post);

router.get('/verification', bgVerifyController.get);

module.exports = router;