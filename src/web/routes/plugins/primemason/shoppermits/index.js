const router = require('express').Router();

//Controller
// Create
const createController = require('../../../../controllers/plugins/primemason/shoppermits/create');

// Manage
const manageController = require('../../../../controllers/plugins/primemason/shoppermits/manage');

// View
const viewController = require('../../../../controllers/plugins/primemason/shoppermits/view');

// Update
const updateController = require('../../../../controllers/plugins/primemason/shoppermits/update');

// Delete
const deleteController = require('../../../../controllers/plugins/primemason/shoppermits/delete');

// Verification
//const verifyController = require('../../../../controllers/plugins/primemason/shoppermits/verify');

/* Routing for create */
router.get('/create', createController.get);
router.post('/create', createController.post);

/** Routing for manage */
router.get('/manage', manageController.get);

/** Routing for view */
router.get('/view', viewController.get);

/** Routing for update */
router.get('/update', updateController.get);
router.post('/update', updateController.post);

/** Routing for delete */
router.post('/delete', deleteController.post);

// /** Routing for share */
// router.post('/share', shareController.post);

// * Routing for verfication 
// router.get('/verification', verifyController.get);

// /** Routing for qrcode */
// router.get('/qrcode', verifyController.getQRCode);

module.exports = router;