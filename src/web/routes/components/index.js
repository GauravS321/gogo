const router = require('express').Router();

// Check route access
const { checkAccess } = require('../../../../helpers/common');


// Blockchain controller
const parametersController = require('../../controllers/components/blockchain/parameters');
const informationController = require('../../controllers/components/blockchain/information');
const runtimeParametersController = require('../../controllers/components/blockchain/runtime-parameters');
const peerinfoController = require('../../controllers/components/blockchain/peerinfo');

// User management
const userManagementController = require('../../controllers/components/user-management');

// List permissions
const listPermissionsController = require('../../controllers/components/permissions/list');

// Manage permissions
const managePermissionsController = require('../../controllers/components/permissions/manage');

// E-signature

// create e-signature controller
const createSignatureController = require('../../controllers/components/esignature/create');

// verify e-signature controller
const verifySignatureController = require('../../controllers/components/esignature/verify');

// verify e-signature controller
const createSaveController = require('../../controllers/components/esignature/create-save');

const verifySavedSignatureController = require('../../controllers/components/esignature/verify-save');

// Data channels controller
// Create
const dcCreateController = require('../../controllers/components/data-channels/create');
// List
const dcListController = require('../../controllers/components/data-channels/list');
// Grant
const dcGrantController = require('../../controllers/components/data-channels/grant');
// Revoke
const dcRevokeController = require('../../controllers/components/data-channels/revoke');

// Publish-data
// publish contoller
const pdPublishController = require('../../controllers/components/data/publish');
// Download controller
const pdDownloadController = require('../../controllers/components/data/download');
// Publish encrypt controller
const pdEncryptController = require('../../controllers/components/data/publish-encrypt');
// Decrypt controller
const pdDecryptController = require('../../controllers/components/data/download-decrypt');

// Publish-file
// Encrypt publish file
const pfEncryptController = require('../../controllers/components/file/publish-encrypt');
// Decrypt download file
const pfDecryptController = require('../../controllers/components/file/download-decrypt');

// CRUD-WIZARD
// Create
const wizardCreateController = require('../../controllers/components/wizard/create');
// List
const wizardListController = require('../../controllers/components/wizard/list');
// View 
const wizardViewController = require('../../controllers/components/wizard/view');
// Update
const wizardUpdateController = require('../../controllers/components/wizard/update');
// Delete
const wizardDeleteContoller = require('../../controllers/components/wizard/delete');

// Blockchain Administration
router.get('/blockchain/parameters', checkAccess, parametersController.get);
router.get('/blockchain/information', checkAccess, informationController.get);
router.get('/blockchain/runtime-parameters', checkAccess, runtimeParametersController.get);
router.get('/blockchain/peer-info', checkAccess, peerinfoController.get);

// User management
// User list
router.get('/user-management/list', checkAccess, userManagementController.get)

// Permissions

// list permissions
router.get('/permissions/list', listPermissionsController.get);

// manage permissions
router.get('/permissions/manage', checkAccess, managePermissionsController.get);
router.post('/permissions/manage', checkAccess, managePermissionsController.post);


// Electronic signatures

// Create signature
router.get('/esignature/create', checkAccess, createSignatureController.get);
router.post('/esignature/create', checkAccess, createSignatureController.post);

// Verify signature
router.get('/esignature/verify', checkAccess, verifySignatureController.get);
router.post('/esignature/verify', checkAccess, verifySignatureController.post);

// Create and save signature
router.get('/esignature/create-save', checkAccess, createSaveController.get);
router.post('/esignature/create-save', checkAccess, createSignatureController.post);

// Create and save signature
router.get('/esignature/verify-save', checkAccess, verifySavedSignatureController.get);
router.post('/esignature/verify-save', checkAccess, verifySavedSignatureController.post);


// Data channels
// Create
router.get('/data-channels/create', checkAccess, dcCreateController.get);
router.post('/data-channels/create', checkAccess, dcCreateController.post);

// List all streams
router.get('/data-channels/list', checkAccess, dcListController.get);

// grant write permission to trade channel
router.get('/data-channels/grant', checkAccess, dcGrantController.get);
router.post('/data-channels/grant', checkAccess, dcGrantController.post);

// revoke write permission to trade channel
router.get('/data-channels/revoke', dcRevokeController.get);
router.post('/data-channels/revoke', dcRevokeController.post);

// Publish Data - publish plain data
router.get('/data/publish', checkAccess, pdPublishController.get);
router.post('/data/publish', checkAccess, pdPublishController.post);

// Data - download plain data
router.get('/data/download', checkAccess, pdDownloadController.get);
router.post('/data/download', checkAccess, pdDownloadController.post);

// Data - publish encrypt-data
router.get('/data/publish-encrypt', checkAccess, pdEncryptController.get);
router.post('/data/publish-encrypt', checkAccess, pdEncryptController.post);

// Data - download decrypt-data
router.get('/data/download-decrypt', checkAccess, pdDecryptController.get);
router.post('/data/download-decrypt', checkAccess, pdDecryptController.post);

//File - publish plain file
router.get('/file/publish-encrypt', checkAccess, pfEncryptController.get);
router.post('/file/publish-encrypt', checkAccess, pfEncryptController.post);

// File - download plian file
router.get('/file/download-decrypt', checkAccess, pfDecryptController.get);
router.post('/file/download-decrypt', checkAccess, pfDecryptController.post);

// // CRUD WIZARD - Form wizards create
// router.get('/wizard/create', wizardCreateController.get);
// router.post('/wizard/create', wizardCreateController.post);

// // CRUD WIZARD - Form wizards List
// router.get('/wizard/list', wizardListController.get);

// // CRUD WIZARD - Form wizards view
// router.get('/wizard/view/:id', wizardViewController.get);

// // CRUD WIZARD -form wizard update
// router.get('/wizard/edit/:id', wizardUpdateController.get);
// router.post('/wizard/update', wizardUpdateController.post);

// // ELEMENT - Form wizards delete
// router.get('/wizard/delete/:id', wizardDeleteContoller.get);

module.exports = router;