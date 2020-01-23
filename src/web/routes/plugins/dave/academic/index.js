const router = require('express').Router();

//Controller
// Issue
const bgIssueController = require('../../controllers/plugins/dave/academic/issue');

// View
const bgViewController = require('../../controllers/plugins/dave/academic/view');

// Share
const bgShareController = require('../../controllers/plugins/dave/academic/share');

// Verification
const bgVerifyController = require('../../controllers/plugins/dave/academic/verify');

// Routes
router.get('/dave/academic/issue', bgIssueController.get);
router.post('/dave/academic/issue', bgIssueController.post);

router.get('/dave/academic/view', bgViewController.get);
router.post('/dave/academic/share', bgShareController.post);

router.get('/dave/academic/verification', bgVerifyController.get);

module.exports = router;