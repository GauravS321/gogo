const router = require('express').Router();

//Controller
// Create
const createController = require('../../../../controllers/plugins/primemason/shoppermits/create');

// Manage shops
const manageShopsController = require('../../../../controllers/plugins/primemason/shoppermits/manage-shops');

// Manage permits
const managePermitsController = require('../../../../controllers/plugins/primemason/shoppermits/manage-permits');

// View
const viewController = require('../../../../controllers/plugins/primemason/shoppermits/view');

// Update
const updateController = require('../../../../controllers/plugins/primemason/shoppermits/update');

// Delete
const deleteController = require('../../../../controllers/plugins/primemason/shoppermits/delete');

// Add permits
const addPermitsController = require('../../../../controllers/plugins/primemason/shoppermits/add-permits');


// Verification
//const verifyController = require('../../../../controllers/plugins/primemason/shoppermits/verify');

/* Routing for create */
router.get('/create', createController.get);
router.post('/create', createController.post);

/** Routing for manage shops */
router.get('/manage-shops', manageShopsController.get);

/** Routing for view */
router.get('/view', viewController.get);

/** Routing for update */
router.get('/update', updateController.get);
router.post('/update', updateController.post);

/** Routing for delete */
router.post('/delete', deleteController.post);

// /** Routing for share */
// router.post('/share', shareController.post);

/** Routing for manage permits */
router.get('/manage-permits', managePermitsController.get);

/** Routing for add permits */
router.get('/add-permits', addPermitsController.get);
router.post('/add-permits', addPermitsController.post);

// * Routing for verfication 
// router.get('/verification', verifyController.get);

// /** Routing for qrcode */
// router.get('/qrcode', verifyController.getQRCode);

module.exports = router;