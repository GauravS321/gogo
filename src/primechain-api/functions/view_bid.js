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

'use strict';

/**
* @author : DJ
* @description : This function grant permission for provided address
* @property : PRIMECHAINTECH
* */

// nodemodule
var bcSdk = require('multichainsdk');

exports.view_bid = (invoice_reference_number) => {
    return new Promise(async function (resolve, reject) {
        let data = [];
        let stream_details = await bcSdk.listStreamKeyItemsStream({
            key: invoice_reference_number,
            stream: "OFFER_DETAIL_STREAM"
        }).then((stream_details) => {
            for (let i = 0; i < stream_details.response.length; i++) {
                data.push(JSON.parse(stream_details.response[i].data))
            }
            return resolve({
                status: 200,
                response: data
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};