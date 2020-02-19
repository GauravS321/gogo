const router = require('express').Router();

//Controller
// Create record
const createController = require('../../../../controllers/plugins/primemason/primeqr/create');

// Manage records
const manageController = require('../../../../controllers/plugins/primemason/primeqr/manage');

// // Manage permits
// const managePermitsController = require('../../../../controllers/plugins/primemason/primeqr/manage-permits');

// View
const viewController = require('../../../../controllers/plugins/primemason/primeqr/view');

// Update
const updateController = require('../../../../controllers/plugins/primemason/primeqr/update');

// Delete
const deleteController = require('../../../../controllers/plugins/primemason/primeqr/delete');

// Add new input to existing record
const addInputController = require('../../../../controllers/plugins/primemason/primeqr/add-input');

// View permits
const viewInputsController = require('../../../../controllers/plugins/primemason/primeqr/view-inputs');

// Share 
const shareController = require('../../../../controllers/plugins/primemason/primeqr/share');

// Verification
const verifyController = require('../../../../controllers/plugins/primemason/primeqr/verify');

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
router.get('/view-inputs', viewInputsController.get);

/* Routing for verfication */
router.get('/verification', verifyController.get);

/** Routing for qrcode */
router.get('/qrcode', verifyController.getQRCode);

module.exports = router;