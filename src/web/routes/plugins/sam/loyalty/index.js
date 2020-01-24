const router = require('express').Router();

// create asset
const createController = require('../../../../controllers/plugins/sam/loyalty/create');
// view assets
const viewController = require('../../../../controllers/plugins/sam/loyalty/view');
// transfer assets
const transferController = require('../../../../controllers/plugins/sam/loyalty/transfer');
// send assets
const sendController = require('../../../../controllers/plugins/sam/loyalty/send');

// SAM - create asset
router.get('/create', createController.get);
router.post('/create', createController.post);

// SAM - view my asset
router.get('/view', viewController.get);

// SAM - transfer asset
router.get('/transfer', transferController.get);
router.get('/transfer/:name', sendController.get);
router.post('/send', sendController.post);

module.exports = router;