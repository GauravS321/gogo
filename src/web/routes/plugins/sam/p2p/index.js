const router = require('express').Router();

// create asset
const createController = require('../../../../controllers/plugins/sam/p2p/create');

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