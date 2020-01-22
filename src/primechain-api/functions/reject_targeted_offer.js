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
 * @description : This function rejects atomic raw transaction of provided tx_id.
 * @property : PRIMECHAINTECH
 * */


const bcsdk = require('multichainsdk');
const async = require('async');

exports.reject_targeted_offer = (tx_id, primechain_address) => {
    return new Promise(async function (resolve, reject) {

        let authorized_user = await bcsdk.listStreamKeyItemsStream({
            key: primechain_address,
            stream: "OFFER_DETAIL_STREAM"
        }).then((authorized_user) => {
            async.forEach(authorized_user.response, (user, cb2) => {
                let parse_output = JSON.parse(user.data)
                if (parse_output.txid === tx_id && parse_output.to_address === primechain_address) {
                    bcsdk.lockUnspent({
                        transactionId: tx_id,
                        vout: 0
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
                }
                cb2();

            }, (err) => {
                if (err) {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                }
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};