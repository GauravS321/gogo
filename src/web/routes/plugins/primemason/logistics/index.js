const router = require('express').Router();

//Controller
// Create record
const createController = require('../../../../controllers/plugins/primemason/logistics/create');

// Manage records
const manageController = require('../../../../controllers/plugins/primemason/logistics/manage');

// // Manage permits
// const managePermitsController = require('../../../../controllers/plugins/primemason/logistics/manage-permits');

// View
const viewController = require('../../../../controllers/plugins/primemason/logistics/view');

// Update
const updateController = require('../../../../controllers/plugins/primemason/logistics/update');

// Delete
const deleteController = require('../../../../controllers/plugins/primemason/logistics/delete');

// Add new input to existing record
const addInputController = require('../../../../controllers/plugins/primemason/logistics/add-input');

// // View permits
// const viewPermitsController = require('../../../../controllers/plugins/primemason/logistics/view-permits');

// Share permits
const shareController = require('../../../../controllers/plugins/primemason/logistics/share');

// Verification
const verifyController = require('../../../../controllers/plugins/primemason/logistics/verify');

/* Routing for create */
router.get('/create', createController.get);
router.post('/create', createController.post);

/** Routing for manage  */
router.get('/manage', manageController.get);

/** Routing for view */
router.get('/view', viewController.get);

/** Routing for update */
router.get('/update', updateController.get);
router.post('/update', updateController.post);

/** Routing for delete */
router.post('/delete', deleteController.post);

// /** Routing for share */
router.post('/share', shareController.post);

// /** Routing for manage permits */
// router.get('/manage-permits', managePermitsController.get);

// * Routing for add permits 
 //router.get('/add-inputs', addPermitsController.get);
 router.post('/add-inputs', addInputController.post);

// /** Routing for view permits */
// router.get('/view-permits', viewPermitsController.get);

/* Routing for verfication */
router.get('/verification', verifyController.get);

/** Routing for qrcode */
router.get('/qrcode', verifyController.getQRCode);

module.exports = router;