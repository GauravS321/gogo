const router = require('express').Router();

// Bank-guarantee controller
// Issue
const bgIssueController = require('../../controllers/plugins/dave/bank-guarantee/issue');
// View
const bgViewController = require('../../controllers/plugins/dave/bank-guarantee/view');
// share
const bgShareController = require('../../controllers/plugins/dave/bank-guarantee/share');
// verification
const bgVerifyController = require('../../controllers/plugins/dave/bank-guarantee/verify');

// Plugins - DAVE
// Bank Guarnatee - issue
router.get('/dave/bank-guarantee/issue', bgIssueController.get);
router.post('/dave/bank-guarantee/issue', bgIssueController.post);

router.get('/dave/bank-guarantee/view', bgViewController.get);
router.post('/dave/bank-guarantee/share', bgShareController.post);

router.get('/dave/bank-guarantee/verification', bgVerifyController.get);

// // Plugins - Bank Guarantee - retrieve 
// router.get('/plugins/bank-guarantee/retrieve', userController.getRetrieveBG);

// router.post('/plugins/bank-guarantee/retrieve', userController.postRetrieveBG);


module.exports = router;
