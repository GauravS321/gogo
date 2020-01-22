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
 * @description : This function retrieve blockchain information.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');

exports.blockchain_info = () => {
    return new Promise(async function (resolve, reject) {
        var blockchain_detail = {};
        let blockchaindetail = await bcSdk.getInfo({

        }).then((blockchaindetail) => {
            bcSdk.getBlockchainInfo({

            }).then((res) => {

                blockchain_detail = {
                    "version": blockchaindetail.response.version,
                    "nodeversion": blockchaindetail.response.nodeversion,
                    "protocolversion": blockchaindetail.response.protocolversion,
                    "chainname": blockchaindetail.response.chainname,
                    "description": blockchaindetail.response.description,
                    "protocol": blockchaindetail.response.protocol,
                    "port": blockchaindetail.response.port,
                    "setupblocks": blockchaindetail.response.setupblocks,
                    "nodeaddress": blockchaindetail.response.nodeaddress,
                    "burnaddress": blockchaindetail.response.burnaddress,
                    "incomingpaused": blockchaindetail.response.incomingpaused,
                    "miningpaused": blockchaindetail.response.miningpaused,
                    "offchainpaused": blockchaindetail.response.offchainpaused,
                    "walletversion": blockchaindetail.response.walletversion,
                    "balance": blockchaindetail.response.balance,
                    "walletdbversion": blockchaindetail.response.walletdbversion,
                    "reindex": blockchaindetail.response.reindex,
                    "blocks": blockchaindetail.response.blocks,
                    "timeoffset": blockchaindetail.response.timeoffset,
                    "connections": blockchaindetail.response.connections,
                    "proxy": blockchaindetail.response.proxy,
                    "difficulty": blockchaindetail.response.difficulty,
                    "testnet": blockchaindetail.response.testnet,
                    "keypoololdest": blockchaindetail.response.keypoololdest,
                    "keypoolsize": blockchaindetail.response.keypoolsize,
                    "paytxfee": blockchaindetail.response.paytxfee,
                    "relayfee": blockchaindetail.response.relayfee,
                    "errors": blockchaindetail.response.errors,
                    "chain": res.response.chain,
                    "chain_name": res.response.chainname,
                    "description_": res.response.description,
                    "protocol_": res.response.protocol,
                    "setup_blocks": res.response.setupblocks,
                    "re_index": res.response.reindex,
                    "blocks_": res.response.blocks,
                    "headers": res.response.headers,
                    "bestblockhash": res.response.bestblockhash,
                    "difficulty_": res.response.difficulty,
                    "verificationprogress": res.response.verificationprogress,
                    "chainwork": res.response.chainwork,
                    "chainrewards": res.response.chainrewards
                }
                return resolve({
                    status: 200,
                    response: blockchain_detail,
                })
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};