const router = require('express').Router();

//Controller
// Create
const createController = require('../../../../controllers/plugins/primemason/shoppermits/create');

// View
//const viewController = require('../../../../controllers/plugins/primemason/shoppermits/view');

// Share
//const shareController = require('../../../../controllers/plugins/primemason/shoppermits/share');

// Verification
//const verifyController = require('../../../../controllers/plugins/primemason/shoppermits/verify');

/* Routing for create */
router.get('/create', createController.get);
router.post('/create', createController.post);

// /** Routing for view */
// router.get('/view', viewController.get);

// /** Routing for share */
// router.post('/share', shareController.post);

// * Routing for verfication 
// router.get('/verification', verifyController.get);

// /** Routing for qrcode */
// router.get('/qrcode', verifyController.getQRCode);

module.exports = router;