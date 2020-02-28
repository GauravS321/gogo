const router = require('express').Router();
const { checkAccess } = require('../../../../../../helpers/common');

// create asset
const createController = require('../../../../controllers/plugins/sam/loyalty/create');

// create more asset
const createMoreController = require('../../../../controllers/plugins/sam/loyalty/create-more');

// SAM - create asset
router.get('/create', checkAccess, createController.get);
router.post('/create', checkAccess, createController.post);

// SAM - create more units of an asset
router.get('/create-more', checkAccess, createMoreController.get);
router.get('/create-more/:reference', checkAccess, createMoreController.getByAssetReference);
router.post('/create-more', checkAccess, createMoreController.post);

module.exports = router;