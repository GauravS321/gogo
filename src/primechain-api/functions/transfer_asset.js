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
 * @description :  This function send asset as per request from blockchain addresss.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');

exports.transfer_asset = (senders_address, receivers_address, asset_name, asset_quantity, senders_private_key) => {
    return new Promise(async function (resolve, reject) {
        let import_address = await bcSdk.importAddress({
            address: senders_address,
            label: "importing address"
        })
        let import_rx_address = await bcSdk.importAddress({
            address: receivers_address,
            label: "importing address"
        })
        let newaddress = await bcSdk.createRawSendFrom({
            from: senders_address,
            addresses: { [receivers_address]: { [asset_name]: asset_quantity } }
        }).then((newaddress) => {
            bcSdk.signRawTransaction({
                hexstring: newaddress.response["hex"],
                private_key: [senders_private_key]
            }).then((res) => {
                bcSdk.sendRawTransaction({
                    hexstring: res.response["hex"]
                }).then((res) => {
                    return resolve({
                        status: 200,
                        response: res.response
                    })
                }).catch(err => {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                })
            }).catch(err => {
                return reject({
                    status: 401,
                    message: err.message
                });
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};