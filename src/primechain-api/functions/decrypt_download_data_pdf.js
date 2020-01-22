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
 * @description : This function decrypts a file and returns a pdf.
 * @property : PRIMECHAINTECH
 * */

// node modules
var bcSdk = require('multichainsdk');
var pdf = require('../pdf_lib/pdf');

exports.decrypt_download_data_pdf = (tx_id, tx_id_sign, key, iv) => {
    return new Promise(async function (resolve, reject) {

        let get_signature_details = await bcSdk.getStreamItem({
            stream: "DATA_SIGNATURE_MASTERLIST",
            txid: tx_id_sign,
        }).then((get_signature_details) => {
            bcSdk.getTxOutData({
                txid: get_signature_details.response.txid,
                vout: get_signature_details.response.vout
            }).then((res) => {
                let data_raw_json = JSON.parse(Buffer.from(res.response, 'hex').toString('utf-8'));

                bcSdk.verifyMessage({
                    address: data_raw_json.address,
                    signature: data_raw_json.signature,
                    message: data_raw_json.file_hash
                }).then((res) => {
                    let signature_response = res.response;
                    if (res.response != false) {
                        bcSdk.listStreamKeyItemsStream({
                            key: data_raw_json.address,
                            stream: "VERIFIED_USER_MASTERLIST"
                        }).then((res) => {
                            let getuser_details = JSON.parse(res.response[0].data);
                            bcSdk.getStreamItem({
                                stream: "DATA_MASTERLIST",
                                txid: tx_id,
                            }).then((res) => {
                                bcSdk.getTxOutData({
                                    txid: res.response.txid,
                                    vout: res.response.vout
                                }).then((res) => {
                                    let data_json = JSON.parse(Buffer.from(res.response, 'hex').toString('utf-8'));
                                    bcSdk.decrypt({
                                        content: data_json.content,
                                        tag: Buffer.from(data_json.tag),
                                        key: key,
                                        iv: iv
                                    }).then((res) => {

                                        pdf.data({
                                            "details": {
                                                data: JSON.parse(res.response),
                                                signature_status: signature_response,
                                                details: {
                                                    "name": getuser_details.verified_user_identifier,
                                                    "primechain_address": data_raw_json.address
                                                }
                                            }
                                        }).then((res) => {
                                            return resolve({
                                                status: 200,
                                                data: res.data,

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
                        }).catch((err) => {
                            return reject({
                                status: 401,
                                message: err.message
                            });
                        })
                    } else {
                        bcSdk.getStreamItem({
                            stream: "DATA_MASTERLIST",
                            txid: tx_id,
                        }).then((res) => {
                            bcSdk.getTxOutData({
                                txid: res.response.txid,
                                vout: res.response.vout
                            }).then((res) => {
                                let data_json = JSON.parse(Buffer.from(res.response, 'hex').toString('utf-8'));
                                bcSdk.decrypt({
                                    content: data_json.content,
                                    tag: Buffer.from(data_json.tag),
                                    key: key,
                                    iv: iv
                                }).then((res) => {
                                    pdf.data({
                                        "details": {
                                            data: JSON.parse(res.response),
                                            signature_status: signature_response
                                        }
                                    }).then((res) => {
                                        return resolve({
                                            status: 200,
                                            data: res.data,

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
                    }
                }).catch((err) => {
                    return reject({
                        status: 401,
                        message: err.message
                    })
                })
            }).catch((err) => {
                return reject({
                    status: 401,
                    message: err.message
                })
            })
        }).catch((err) => {
            return reject({
                status: 401,
                message: err.message
            })
        })
    });
}
