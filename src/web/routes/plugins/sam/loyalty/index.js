const router = require('express').Router();

// create asset
const createController = require('../../../../controllers/plugins/sam/loyalty/create');

// create more asset
const createMoreController = require('../../../../controllers/plugins/sam/loyalty/create-more');

// SAM - create asset
router.get('/create', createController.get);
router.post('/create', createController.post);

// SAM - create more units of an asset
router.get('/create-more', createMoreController.get);
router.get('/create-more/:reference', createMoreController.getByAssetReference);
router.post('/create-more', createMoreController.post);

module.exports = router;