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
 * @description : This function creates new asset and stores details to Blockchain stream.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');

exports.create_invoice = (invoice_payer, invoice_payee, invoice_name, invoice_details) => {
    return new Promise(async function (resolve, reject) {

        let blockchainparams = await bcSdk.issueFrom({
            from: invoice_payer,
            to: invoice_payee,
            asset: { "name": invoice_name, "open": false },
            qty: 1,
            unit: 1,
            details: invoice_details
        }).then((blockchainparams) => {
            bcSdk.subscribe({
                stream: invoice_name
            }).then((res) => {
                bcSdk.listAssetsbyName({
                    asset: invoice_name
                }).then((res) => {
                    var asset_details = res.response;
                    let data = {
                        name: asset_details[0].name,
                        issuetxid: asset_details[0].issuetxid,
                        invoice_reference_number: asset_details[0].assetref,
                        issuers: asset_details[0].issues[0].issuers[0],
                        description: asset_details[0].details
                    }
                    bcSdk.publishFrom({
                        from: invoice_payer,
                        key: [invoice_payee, data.invoice_reference_number],
                        value: JSON.stringify(data),
                        stream: "INVOICE_MASTERLIST"
                    }).then((res) => {
                        return resolve({
                            status: 200,
                            response: {
                                tx_id: asset_details[0].issuetxid,
                                invoice_reference_number: asset_details[0].assetref,
                                invoice_details: asset_details[0].details
                            }
                        })
                    }).catch((err) => {
                        return reject({
                            status: 401,
                            message: err.message
                        });
                    })
                }).catch((err) => {
                    return reject({
                        status: 401,
                        message: "This instrument has been randomly selected for manual verification. It will be published to the blockchain after successful verification."
                    });
                })
            }).catch((err) => {
                return reject({
                    status: 401,
                    message: err.message
                });
            })
        }).catch((err) => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};