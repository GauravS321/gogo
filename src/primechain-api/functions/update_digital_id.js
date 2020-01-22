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
 * @description : This function update existing identifiers.
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');

exports.update_digital_id = (employee_primechain_address, customer_primechain_address, data) => {
    return new Promise(async function (resolve, reject) {

        let get_recent_one = await bcSdk.listStreamLatestRecord({
            "key": customer_primechain_address,
            "stream_name": "DIGITAL_ID_MASTERLIST"
        }).then((get_recent_one) => {
            let blockchain_data = JSON.parse(get_recent_one.response)

            let update_email_id = (data.email_id != null) ? data.email_id : blockchain_data.email_id;
            let update_cell_number = (data.cell_number != null) ? data.cell_number : blockchain_data.cell_number;
            let update_name = (data.name != null) ? data.name : blockchain_data.name;
            let update_country = (data.country != null) ? data.country : blockchain_data.country;

            bcSdk.publishFrom({
                from: employee_primechain_address,
                key: [update_cell_number, update_email_id, update_name, update_country, blockchain_data.blockchain_address],
                value: JSON.stringify(data),
                stream: "DIGITAL_ID_MASTERLIST"
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
    })
};