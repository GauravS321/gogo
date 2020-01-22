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
 * @description : This function retrieve assets and amount as per request from blockchain addresss
 * @property : PRIMECHAINTECH
 * */
// nodemodule
var bcSdk = require('multichainsdk');

exports.address_balances = (primechain_address) => {
    return new Promise(async function (resolve, reject) {

        let address_transactions = await bcSdk.getAddressBalances({
            address: primechain_address
        }).then((address_transactions) => {
            return resolve({
                status: 200,
                response: address_transactions.response
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};