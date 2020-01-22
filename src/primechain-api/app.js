// /** 
// Copyright 2018 Primechain Technologies Private Limited.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// */

// //this is the start of the application 
// 'use strict';
// /**
//  * @author : DJ,
//  * @description : This file runs the server.
//  * @property : PRIMECHAINTECH
//  * */

// // node modules

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const router = require('./routes');
// var fileUpload = require('express-fileupload');
// var https = require('https');
// var fs = require('fs');

// var options = {
//   key: fs.readFileSync(__dirname + '/privkey.pem'),
//   cert: fs.readFileSync(__dirname + '/cert.pem'),
//   requestCert: false,
//   rejectUnauthorized: false
// };
// app.use(bodyParser.json());
// app.use(fileUpload());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded(
//   {
//     limit: "50mb",
//     extended: true
//   }
// ));
// app.use('/', router);

// var port = process.env.PORT || 2512;
// var server = https.createServer(options, app);

// server.listen(port, function () {
//   console.log(`App Runs on ${port}`);
// });


/** 
Copyright 2018 Primechain Technologies Private Limited.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

//this is the start of the application 
'use strict';
/**
 * @author : DJ,
 * @description : This file runs the server.
 * @property : PRIMECHAINTECH
 * */

//this is the start of the application 
// node modules
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const routes = require('./routes');
const portnumber = require('./config/server');

const app = express();

app.use(fileUpload());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded(
  {
    limit: "50mb",
    extended: true
  }
));

app.use('/', routes);

app.listen(portnumber);

console.log(`App Runs on ${portnumber}`);
