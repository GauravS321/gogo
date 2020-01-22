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
* @description : This function returns data as per provided publishers address from Blockchain.
* @property : PRIMECHAINTECH
* */

// nodemodule
var bcSdk = require('multichainsdk');

exports.list_trade_channel_items_by_publisher = (primechain_address, trade_channel_name) => {
    return new Promise(async function (resolve, reject) {

        let stream_item = await bcSdk.listStreamPublisherItemsTrade({
            address: primechain_address,
            stream: trade_channel_name
        }).then((stream_item) => {

            return resolve({
                status: 200,
                response: stream_item.response
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};