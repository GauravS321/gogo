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
 * @description : This function returns all identifiers available on provided stream.
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');
var async = require('async');

exports.search_digital_id = (key, stream_name) => {
    return new Promise(async function (resolve, reject) {
        var hash_info = [];
        let retrieve_blockchain_data = await bcSdk.listStreamKeyItemsStream({
            key: key,
            stream: stream_name
        }).then((retrieve_blockchain_data) => {
            async.forEach(retrieve_blockchain_data.response, (item, callback_1) => {
                hash_info.push(item.key)
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
        }).catch((err) => {
            return reject({
                status: 401,
                message: err.message
            })
        })
    })
};