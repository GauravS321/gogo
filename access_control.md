1. Go to helpers -> common.js and add relevant entry under `const routesSecurity`

2. Create a new entry with checkAccess in relevant js file in src->web->routes e.g. 
```
// Data - publish encrypt-data
router.get('/data/publish-encrypt', checkAccess, pdEncryptController.get);
router.post('/data/publish-encrypt', checkAccess, pdEncryptController.post);
```
