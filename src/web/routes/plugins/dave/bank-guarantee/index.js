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
router.get('/dave/bank-guarantee/issue', bgIssueController.get);
router.post('/dave/bank-guarantee/issue', bgIssueController.post);

router.get('/dave/bank-guarantee/view', bgViewController.get);
router.post('/dave/bank-guarantee/share', bgShareController.post);

router.get('/dave/bank-guarantee/verification', bgVerifyController.get);

module.exports = router;