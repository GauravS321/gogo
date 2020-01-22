// publish_to_gesr
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
 * @description : This function returns all the address and its details for given hash
 * @property : PRIMECHAINTECH
 * */

'use strict';

var bcSdk = require('multichainsdk');
var async = require('async');
let date = require('date-and-time');
var timestamp = require('unix-timestamp');


exports.get_from_great = (hash) => {
    return new Promise(async function (resolve, reject) {
        var hash_info = [];
        let get_hash_details = await bcSdk.listStreamKeyItemsStream({
            key: hash,
            stream: "GREAT"
        }).then((get_hash_details) => {
            if (get_hash_details.response != null) {
                async.forEach(get_hash_details.response, (item, callback_1) => {
                    var hash_json = JSON.parse(item.data)
                    var t = timestamp.toDate(item.timereceived);
                    hash_info.push({
                        signer_address: hash_json.address,
                        signature: hash_json.signature,
                        timestamp: date.format(t, 'DD/MM/YYYY hh:mm:ss:SS'),
                    })
                    callback_1();
                }, (err) => {
                    if (err) {
                        return resolve({
                            status: 401,
                            response: err.message
                        })
                    } else {
                        return resolve({
                            status: 200,
                            response: hash_info
                        })
                    }
                })
            } else {
                return resolve({
                    status: 401,
                    response: "This hash is not available in Blockchain"
                });
            }
        })
    })
};