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
 * @description : This function creates digital ID.
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');

exports.create_digital_id = (primechain_address, keys, data, stream_name) => {
    return new Promise(async function (resolve, reject) {
        let create_entity = await bcSdk.getNewAddress();
        let myObj = {};
        myObj = {
            "data": data
        }
        myObj["data"]["blockchain_address"] = create_entity.response[0].address;
        keys.push(create_entity.response[0].address)
        let upload_to_blockchain = await bcSdk.publishFrom({
            from: primechain_address,
            key: keys,
            value: JSON.stringify(myObj.data),
            stream: stream_name
        }).then((upload_to_blockchain) => {
            return resolve({
                status: 200,
                response: upload_to_blockchain.response,
                address: create_entity.response[0].address
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })

    })
};