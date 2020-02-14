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
**/

'use strict';

/**
 * @author : DJ,
 * @description : This file routes the input from end user to multichain functions.
 * @property : PRIMECHAINTECH
 * */

// node modules

const router = require('express').Router();
const fs = require('fs');
const json2xls = require('json2xls');
const bcsdk = require('multichainsdk');

//error codes 

const err_code = require('./error-code/error');

// API Management (AM) require modules

const get_api_key = require('./functions/get_api_key');
const create_rsa_keypair = require('./functions/create_rsa_keypair');

// Blockchain Administration (BA) require modules

const blockchain_params = require('./functions/blockchain_params');
const runtime_params = require('./functions/runtime_params');
const blockchain_info = require('./functions/blockchain_info');
const mempool_info = require('./functions/mempool_info');
const raw_mempool = require('./functions/raw_mempool');
const list_blocks = require('./functions/list_blocks');
const peer_info = require('./functions/peer_info');

// Entity Creation and Permission Management (ECPM) require modules

const create_entity = require('./functions/create_entity');
const create_keypair = require('./functions/create_keypair');
const create_entity_rsa = require('./functions/create_entity_rsa');
const create_multisig_address = require('./functions/create_multisig_address');
const manage_permissions = require('./functions/manage_permissions');
// const grant_permissions = require('./functions/grant_permissions');
// const revoke_permissions = require('./functions/revoke_permissions');
const verify_permissions = require('./functions/verify_permissions');
const listpermissions = require('./functions/listpermissions');
const listaddresses = require('./functions/listaddresses');
const validate_address = require('./functions/validate_address');
const list_entities = require('./functions/list_entities');

// Digital Signatures (DS) require modules

const create_signature = require('./functions/create_signature');
const verify_signature = require('./functions/verify_signature');
const create_save_signature = require('./functions/create_save_signature');
const get_from_great = require('./functions/get_from_great');

// Trade Channel (TC) require modules 

const create_trade_channel = require('./functions/create_trade_channel');
const list_data_streams = require('./functions/list_data_streams');
const grant_write_permission_to_trade_channel = require('./functions/grant_write_permission_to_trade_channel');
const revoke_write_permission_to_trade_channel = require('./functions/revoke_write_permission_to_trade_channel');
const subscribe = require('./functions/subscribe');
const unsubscribe = require('./functions/unsubscribe');
const write_to_stream = require('./functions/write_to_stream');
const list_trade_channel_items_by_key = require('./functions/list_trade_channel_items_by_key');
const list_trade_channel_items_by_publisher = require('./functions/list_trade_channel_items_by_publisher');
const list_stream_keys = require('./functions/list_stream_keys');
const list_stream_items = require('./functions/list_stream_items');

// Smart Asset Management (SAM) require modules

const create_token = require('./functions/create_token');
const create_more_token = require('./functions/create_more_token');
const asset_details = require('./functions/asset_details');
const asset_balances = require('./functions/asset_balances');
const assets_held_by_entity = require('./functions/assets_held_by_entity');
const send_asset = require('./functions/send_asset');
const transfer_multisign_asset = require('./functions/transfer_multisign_asset');
const transfer_asset = require('./functions/transfer_asset');
const entity_transaction_list = require('./functions/entity_transaction_list');

// Offer Management require modules (OM)

const create_public_offer = require('./functions/create_public_offer');
const get_open_offer = require('./functions/get_open_offer');
const read_offer = require('./functions/read_offer');
const accept_offer = require('./functions/accept_offer');
const cancel_public_offer = require('./functions/cancel_public_offer');
const create_targeted_offer = require('./functions/create_targeted_offer');
const reject_targeted_offer = require('./functions/reject_targeted_offer');
const get_targeted_offer = require('./functions/get_targeted_offer');

// Encrypted Data Storage require modules (EDS) 

const encrypt_sign_store_data = require('./functions/encrypt_sign_store_data');
const decrypt_download_data = require('./functions/decrypt_download_data');
const encrypt_sign_store_file = require('./functions/encrypt_sign_store_file');
const decrypt_download_file = require('./functions/decrypt_download_file');
const decrypt_download_data_pdf = require('./functions/decrypt_download_data_pdf');

// Invoice Discounting require modules (ID)

const create_invoice = require('./functions/create_invoice');
const create_bid = require('./functions/create_bid');
const cancel_bid = require('./functions/cancel_bid');
const view_bid = require('./functions/view_bid');
const view_all_bids = require('./functions/view_all_bids');
const reject_bid = require('./functions/reject_bid');
const accept_bid = require('./functions/accept_bid');
const retire_invoice = require('./functions/retire_invoice');
const view_all_invoice = require('./functions/view_all_invoice');

// Non-Blockchain require modules (NB)

const uuid = require('./functions/uuid');
const get_password = require('./functions/get_password');
const create_string_timestamp = require('./functions/create_string_timestamp');

// On-Board User require modules (OBU)

const onboard_user = require('./functions/onboard_user');
const login_request = require('./functions/login_request');
const session_key_auth = require('./functions/session_key_auth');
const get_rsa_key = require('./functions/get_rsa_key');
const list_onboarded_user_details = require('./functions/list_onboarded_user_details');

// Secure Communication require modules (SC)

const comm_create = require('./functions/comm_create');

// Digital Id require modules (DI)

const create_digital_id = require('./functions/create_digital_id');
const search_digital_id = require('./functions/search_digital_id');
const retrieve_details = require('./functions/retrieve_details');
const request_otp = require('./functions/request_otp');
const update_digital_id = require('./functions/update_digital_id');

// Common utilities function require modules

const common = require('./lib/common');

// Other API's require modules 

const importaddress = require('./functions/importaddress');
const wallet_transactions = require('./functions/wallet_transactions');
const address_transaction = require('./functions/address_transaction');
const address_balances = require('./functions/address_balances');
const create_signer = require('./functions/create_signer');
const connect_node = require('./functions/connect_node');
const get_asset_info = require('./functions/get_asset_info');
const asset_transaction_list = require('./functions/asset_transaction_list');
const list_all_asset = require('./functions/list_all_asset');
const encrypt_data_rsa = require('./functions/encrypt_data_rsa');
const decrypt_data_rsa = require('./functions/decrypt_data_rsa');
const encrypt_data_aes = require('./functions/encrypt_data_aes');
const decrypt_data_aes = require('./functions/decrypt_data_aes');
const publish_data = require('./functions/publish_data');
const get_data = require('./functions/get_data');


/* Route Handlers starts from here */

//  API Management routing

/**
   * @api {get} /api/v1/get_api_key 
   * @apiVersion 1.0.0
   * @apiName Generate API key
   * @apiGroup API managemant
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = null;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {String} api_key 
   * @apiSuccess {String} message
   *
   * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
    *        "api_key": "API-key",
            "message": {
                  "14040": "A new API key has been successfully generated"
              }
    *      }
    *
   */

router.get('/api/v1/get_api_key', (req, res) => {
  get_api_key
    .get_api_key()
    .then(result => {
      res
        .status(result.status)
        .json({
          status: result.status,
          api_key: result.response,
          message: result.message
        });
    })
    .catch(err => {
      res
        .status(err.status)
        .json({
          message: err.message
        });
    });
});

/**
   * @api {get} /api/v1/create_rsa_keypair 
   * @apiVersion 1.0.0
   * @apiName Create RSA keypairs
   * @apiGroup API Management
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = null;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {String} rsa_public_key
   * @apiSuccess {String} rsa_pub_key_id
   *
   * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
    *       {
                "rsa_public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAytlqdXYhS1rxmicrlLU2\nnPebspAHGxpei+caoS9BX/rG8dsmtjsnmCcwmC1P6fcV6RlTFOKm3CJnvG/3Hms3\nrEHKNpaQt7sQIU10nikjeKTWBq15l3KBV3SOUr+mJhHyEWXFnTLg822VltyHqD+A\ny8seoJaRfMPxwV5l0n/ry9kg67STo8U2sb18orE+ZmgpUu1Hq+6P8oPr5x5pFiHD\nWUgNILe+7NzqCDwvmrcI9uOcBcUBC2BxKtGxro+02KEvnUiLn0PhM/Wu8vNvYgJh\nTRQYsiDwrxcVRTlg4YtuW+BtPXlMuCac46n/5gBmnlUGRJrV5E3hbFvWCS6R533X\n0QIDAQAB\n-----END PUBLIC KEY-----",
                "rsa_pub_key_id": "5c4573ed47bdd255706d733b"
              }
    *      }
    *
   */
router.get('/api/v1/create_rsa_keypair', (req, res) => {
  create_rsa_keypair
    .create_rsa_keypair()
    .then(result => {
      res
        .status(result.status)
        .json({
          status: result.status,
          response: result.response,
        });
    })
    .catch(err => {
      res
        .status(err.status)
        .json({
          message: err.message
        });
    });
});

/**
   * @api {get} /api/v1/blockchain_params 
   * @apiVersion 1.0.0
   * @apiName Blockchain parameters
   * @apiGroup Blockchain Administration
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = token;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {Object} List of blockchain parmaeters
   *
   * @apiSuccessExample {json} Success response:
   *     HTTPS 200 OK
   *     {
               blockchain_info: {Object} 
   *     }
   *
**/

router.get('/api/v1/blockchain_params', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      blockchain_params
        .blockchain_params()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              blockchain_params: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

/**
   * @api {get} /api/v1/blockchain_info 
   * @apiVersion 1.0.0
   * @apiName Blockchain information
   * @apiGroup Blockchain Administration
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = token;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {Object} List of blockchain information
   *
   * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
               blockchain_info: {Object}
    *     }
    *
   */
router.get('/api/v1/blockchain_info', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      blockchain_info
        .blockchain_info()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              blockchain_info: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

/**
   * @api {get} /api/v1/mempool_info 
   * @apiVersion 1.0.0
   * @apiName Memory pool information
   * @apiGroup Blockchain Administration
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = token;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {Object} memorypool information 
   *
   * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
             "mempool_info": {
                                  "size": 0,
                                  "bytes": 0
                              }
    *     }
    *
   */
router.get('/api/v1/mempool_info', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      mempool_info
        .mempool_info()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              mempool_info: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

/**
   * @api {get} /api/v1/raw_mempool 
   * @apiVersion 1.0.0
   * @apiName Raw memory pool information
   * @apiGroup Blockchain Administration
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = token;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {Array} raw memorypool information 
   *
   * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
             "raw_mempool": []
    *     }
    *
   */
router.get('/api/v1/raw_mempool', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      raw_mempool
        .raw_mempool()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              raw_mempool: result.response
            });
        })
        .catch(err => {
          res.status(err.status).json({
            status: err.status,
            message: err.message
          });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

/**
   * @api {get} /api/v1/runtime_params 
   * @apiVersion 1.0.0
   * @apiName Runtime parmaters
   * @apiGroup Blockchain Administration
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = token;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {Object} Blockchain runtime parameters 
   *
   * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
              "runtime_params" : {List blockchain runtime parameters}
    *     }
    *
   */
router.get('/api/v1/runtime_params', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      runtime_params
        .runtime_params()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              runtime_params: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

/**
   * @api {get} /api/v1/create_entity_rsa 
   * @apiVersion 1.0.0
   * @apiName Create entity RSA
   * @apiGroup Blockchain Administration
   * @apiPermission authenticated user
   *
   * @apiParam null
   *
   * @apiExample {js} Example usage:
   * $http.defaults.headers.common["Authorization"] = token;
   * $http.get(url)
   *   .success((res, status) => doSomethingHere())
   *   .error((err, status) => doSomethingHere());
   *
   * @apiSuccess {String} primechain_address
   * @apiSuccess {String} primechain_private_key
   * @apiSuccess {String} primechain_public_key
   * @apiSuccess {String} rsa_private_key
   * @apiSuccess {String} rsa_public_key
   *
   * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
              {
                  "primechain_address": "1ELUriEu4wP3Wqr3u3H6ekKqGKcLgWEYF3wc6L",
                  "primechain_private_key": "V7DcZwtPa1YK2AmghdvXg4nnFZh3YzZBr72iyBnWVWogfzefdTH4H1uP",
                  "primechain_public_key": "03fadd812f2ff6804929ddc7cabc290db08cd4e33fdcab2781351f4155a4d85d29",
                  "rsa_private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCQp6g4QFKiwbF9\najri+E2D9osDS8yIVuwfdszXJAVfZHnFCGgERMnCSaP0K8CPruDsY1Rej2k59mIH\njnCvCIlSsXEltvPb9kq2kEqYXzUixvzMT/3zxgJo5vCRvaq2DUo/wCAK2kHpjeYc\ni2XGyKG6wqBHhybllMvFqnM0uw9AsSXNu2Pa35cwGG/il7yv5H3+rnOvuGKafEhT\nxjeJNg7NNxIKg4fWqjh5eE8dxaGR4tYPWkRuMov697Lvh0cESM8vTb7w6NgjSlha\ntU+PNWQ3ZXS+UhsjZS4xBBPePma64TJA26ki5fR+WukzVCylD0oJ0Qo5vHEKyeK6\nP+3SoiBRAgMBAAECggEBAIRYYBfXAcPW4sSTxHyUIJdzoYvKdb7nh/DhiFftpNy5\n2I7kOgZtyQnwxghHX04V+cNMvYwmOWfGe7neIEqDzN/TaGnRERtWItUU/qqZsMu4\nsuFa7kVyDBJd+AvfM6iMUDozVR2YwmUkZjwHbX6JYS61kl7e0D+L+0NFx1GfMz1D\ndbNdwk8W/P7EmIQdnviU3g+6VPsz99I26XD1wtGjNLUJGk4ZLRwAShOLZRXM8Ito\nDLegEp+QYgKJMQx2Nd3yBuF53yfzIUATvIKzBe4a1is/CPfDJNadVWxzAhLM1AvL\nX4iQYszPv4jS+WQeacZUk4jl3UdExIEXKecj9A3AxIECgYEAx0op8pXAwhMtM4fa\nqAoCRrkfdyakf1h2z8WZ7Z+IVO12Q68y9SAk8anqLcQ+twvbYJQpkYCBLBIDvNsX\nggFR2LI9N8nTNLjHu2WdaHw11Ooz8jL6zSuJlvqEM23yAz5G5OUXGNPYEdxSnkgN\nLgE9Eb4ufmYBA1lvUK0EU+CLhu0CgYEAudF2o8ziqoemYU7ttK1QNFCOHMoSnG0H\ngTKJG995cK0tZCJ20HHyPickahjcYboUm8WHEfPLQh0HAUsFboK1f8f3Ny96J5Yj\n8mwynCpBXD8QkMIk3tnTRgQmzcx9i09h7i7I2l8HRkxKNFiCZrF9m3YegakqNvvd\n41D5OO9ejnUCgYABjDzpKmqV10pJlSuIlJNR80wgQ8eRSaGamYFJjCyl5DY/7lNp\n/fbrfZNZCaYnC8uHY38zJxlZu0YWKGl1VAdLtI6vKT0fsrOya+aeEiDk53DB182E\n3Gq0JnvyXk874TbxvinAwpxx/xERM6QOkGnmAmEgEDC/0uj/amiXMi5DPQKBgHTa\nGU6GoJ/2sBWPagJt3vsXEVdfZ/bAxbBklD5X+Wl3Lg1Dcw5AKcMWIFssCSLXvu/6\ndqc+dbq8wFP61o6ZWgPiPz+P9rSAQVjI28bC99lHu2YdAMy3lJn6MGDI0MZThFUh\nTKOukMePYDas1kw4H7IsxKBrPiXXm8DAgglg1kilAoGBAMCStLRow7gkyts50wqg\nOQRdCLWtDIU8Xz9j8jPEwnhczN9Kq2DJXKcQIWi/mL9Ra1i6SZkQp5fO/+ebHJY5\ncIKmM2ydk0tHUezeAhaRtq+DD1i/wR2hM8xc1tg/9vpPbZq5k3IEPK6fOdnuaDzx\nxIVyThKjZkNNELPIX7CBzKrW\n-----END PRIVATE KEY-----",
                  "rsa_public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkKeoOEBSosGxfWo64vhN\ng/aLA0vMiFbsH3bM1yQFX2R5xQhoBETJwkmj9CvAj67g7GNUXo9pOfZiB45wrwiJ\nUrFxJbbz2/ZKtpBKmF81Isb8zE/988YCaObwkb2qtg1KP8AgCtpB6Y3mHItlxsih\nusKgR4cm5ZTLxapzNLsPQLElzbtj2t+XMBhv4pe8r+R9/q5zr7himnxIU8Y3iTYO\nzTcSCoOH1qo4eXhPHcWhkeLWD1pEbjKL+vey74dHBEjPL02+8OjYI0pYWrVPjzVk\nN2V0vlIbI2UuMQQT3j5muuEyQNupIuX0flrpM1QspQ9KCdEKObxxCsniuj/t0qIg\nUQIDAQAB\n-----END PUBLIC KEY-----"
              }
    *     }
    *
   */
router.get('/api/v1/create_entity_rsa', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      create_entity_rsa
        .create_entity_rsa()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              response: {
                primechain_address: result.address,
                primechain_private_key: result.priv_key,
                primechain_public_key: result.pub_key,
                rsa_private_key: result.private_key,
                rsa_public_key: result.public_key,
              }
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

/**
    * @api {post} /api/v1/encrypt_data_rsa
    * @apiVersion 1.0.0
    * @apiName Encrypt data rsa
    * @apiGroup Data storage and Authentiation
    * @apiPermission authenticated user
    *
    * @apiParam (Request body) {String} rsa_public_key
    * @apiParam (Request body) {String} data
    * @apiParamExample {json} :
           {
               "rsa_public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkKeoOEBSosGxfWo64vhN\ng/aLA0vMiFbsH3bM1yQFX2R5xQhoBETJwkmj9CvAj67g7GNUXo9pOfZiB45wrwiJ\nUrFxJbbz2/ZKtpBKmF81Isb8zE/988YCaObwkb2qtg1KP8AgCtpB6Y3mHItlxsih\nusKgR4cm5ZTLxapzNLsPQLElzbtj2t+XMBhv4pe8r+R9/q5zr7himnxIU8Y3iTYO\nzTcSCoOH1qo4eXhPHcWhkeLWD1pEbjKL+vey74dHBEjPL02+8OjYI0pYWrVPjzVk\nN2V0vlIbI2UuMQQT3j5muuEyQNupIuX0flrpM1QspQ9KCdEKObxxCsniuj/t0qIg\nUQIDAQAB\n-----END PUBLIC KEY-----",
               "data": "Hello Primechain"
            }
    *
    *
    * $http.defaults.headers.common["Authorization"] = token;
    * $http.defaults.headers.common["Content-Type"] = application/json;
    * $http.post(url, data)
    *   .success((res, status) => doSomethingHere())
    *   .error((err, status) => doSomethingHere());
    *
    * @apiSuccess (Success 201) {String} encrypted_data_rsa
    *
    * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
    *        "encrypted_data_rsa": "XWMRAeygXcPsmXyxRFoPqgrjDZWMWhWckumZQALY1mp9amAbgz9f72xuzATxlbR        +PKzRrnJRUVMQCAmDJDxJV/hGjVLNC5UtTVPKxPqKITbUkXJRPuMPkUeXimwIvhoB83MtTWXSCdUFQ2QdJFRFidhu3QW9AmyRM0SW8CRa0m2bM0GbPuU7sYB8BQIya1JCqq3bwXR5c4abkyVMavSmWrhsiHMwM0u5cs1bfgpUfiRiiPxN9oLdwn5BGs8QyLm2Y75WWCmFza7Epz7YBzdOiD54Fl8S7abSAMctRjtV8MNROXIm6i45Xw8l/DHKkyvogrP0F6jHDqTYqCm3B1oNPw=="
    *    }
    *
    */
router.post('/api/v1/encrypt_data_rsa', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {

      let rsa_public_key = req.body.rsa_public_key;
      let data = req.body.data;

      if (!rsa_public_key || !data) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        encrypt_data_rsa
          .encrypt_data_rsa(rsa_public_key, data)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                encrypted_data_rsa: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

/**
    * @api {post} /api/v1/decrypt_data_rsa
    * @apiVersion 1.0.0
    * @apiName Decrypt data rsa
    * @apiGroup Data storage and Authentiation
    * @apiPermission authenticated user
    *
    * @apiParam (Request body) {String} encrypted_data_rsa
    * @apiParam (Request body) {String} rsa_private_key
    * @apiParamExample {json} :
           {
               "rsa_public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkKeoOEBSosGxfWo64vhN\ng/aLA0vMiFbsH3bM1yQFX2R5xQhoBETJwkmj9CvAj67g7GNUXo9pOfZiB45wrwiJ\nUrFxJbbz2/ZKtpBKmF81Isb8zE/988YCaObwkb2qtg1KP8AgCtpB6Y3mHItlxsih\nusKgR4cm5ZTLxapzNLsPQLElzbtj2t+XMBhv4pe8r+R9/q5zr7himnxIU8Y3iTYO\nzTcSCoOH1qo4eXhPHcWhkeLWD1pEbjKL+vey74dHBEjPL02+8OjYI0pYWrVPjzVk\nN2V0vlIbI2UuMQQT3j5muuEyQNupIuX0flrpM1QspQ9KCdEKObxxCsniuj/t0qIg\nUQIDAQAB\n-----END PUBLIC KEY-----",
               "data": "Hello Primechain"
            }
    *
    *
    * $http.defaults.headers.common["Authorization"] = token;
    * $http.defaults.headers.common["Content-Type"] = application/json;
    * $http.post(url, data)
    *   .success((res, status) => doSomethingHere())
    *   .error((err, status) => doSomethingHere());
    *
    * @apiSuccess (Success 201) {String} encrypted_data_rsa
    *
    * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
    *        "encrypted_data_rsa": "XWMRAeygXcPsmXyxRFoPqgrjDZWMWhWckumZQALY1mp9amAbgz9f72xuzATxlbR        +PKzRrnJRUVMQCAmDJDxJV/hGjVLNC5UtTVPKxPqKITbUkXJRPuMPkUeXimwIvhoB83MtTWXSCdUFQ2QdJFRFidhu3QW9AmyRM0SW8CRa0m2bM0GbPuU7sYB8BQIya1JCqq3bwXR5c4abkyVMavSmWrhsiHMwM0u5cs1bfgpUfiRiiPxN9oLdwn5BGs8QyLm2Y75WWCmFza7Epz7YBzdOiD54Fl8S7abSAMctRjtV8MNROXIm6i45Xw8l/DHKkyvogrP0F6jHDqTYqCm3B1oNPw=="
    *    }
    *
    */
router.post('/api/v1/decrypt_data_rsa', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let encrypted_data_rsa = req.body.encrypted_data_rsa;
      let rsa_private_key = req.body.rsa_private_key;

      if (!encrypted_data_rsa || !rsa_private_key) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        decrypt_data_rsa.decrypt_data_rsa(encrypted_data_rsa, rsa_private_key)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                decrypted_data: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// encrypt_data_aes
router.post('/api/v1/encrypt_data_aes', common.checkToken, (req, res) => {
  common.validateAPIKey(req, res)
    .then(() => {
      let data = req.body.data;

      if (!data) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        encrypt_data_aes
          .encrypt_data_aes(data)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: {
                  aes_password: result.password,
                  aes_iv: result.iv,
                  aes_tag: result.encrypted_details.tag,
                  encrypted_data_aes: result.encrypted_details.content
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/decrypt_data_aes', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let encrypted_data_aes = req.body.encrypted_data_aes;
      let aes_password = req.body.aes_password;
      let aes_iv = req.body.aes_iv;
      let aes_tag = req.body.aes_tag;

      if (!encrypted_data_aes || !aes_password || !aes_iv || !aes_tag) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        decrypt_data_aes
          .decrypt_data_aes(encrypted_data_aes, aes_password, aes_iv, aes_tag)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/list_blocks returns blockchain blocks list
router.post('/api/v1/list_blocks', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let block_number = req.body.block_number;

      if (!block_number) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        list_blocks
          .list_blocks(block_number)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                list_blocks: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});


// api/v1/peer_info returns connected peer information
router.get('/api/v1/peer_info', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      peer_info
        .peer_info()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              peer_info: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
})

// api/v1/listaddresses returns public address present in blockchain with mine permission details.
router.get('/api/v1/listaddresses', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      listaddresses
        .listaddresses()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              primechain_address: result.response
            });
        })
        .catch(err => {
          res.status(err.status).json({
            status: err.status,
            message: err.message
          });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
})

// api/v1/importaddress can import addresses of another node of same Blockchain network.
router.post('/api/v1/importaddress', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        importaddress
          .importaddress(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res.status(err.status).json({
              status: err.status,
              message: err.message
            })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/create_multisig_address can create a multisign address
// by providing public address and required multisign address

router.post('/api/v1/create_multisig_address', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let nrequired = req.body.nrequired;
      let primechain_address = req.body.primechain_public_key;

      if (!nrequired || !primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_multisig_address
          .create_multisig_address(nrequired, primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                primechain_address: result.primechain_address
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/create_keypair creates a key pair as follows
// 1.public address
// 2.public key
// 3.private key

router.get('/api/v1/create_keypair', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      create_keypair
        .create_keypair()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              response: {
                primechain_private_key: result.primechain_private_key,
                primechain_address: result.primechain_address,
                primechain_public_key: result.primechain_public_key
              }
            });
        })
        .catch(err => {
          res.status(err.status).json({
            status: err.status,
            message: err.message
          })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// /api/v1/validate_address validates the address
router.post('/api/v1/validate_address', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      } else {
        validate_address
          .validate_address(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: {
                  isvalid: result.response.isvalid,
                  primechain_address: result.response.address,
                  ismine: result.response.ismine,
                  iswatchonly: result.response.iswatchonly,
                  isscript: result.response.isscript,
                  pubkey: result.response.pubkey,
                  iscompressed: result.response.iscompressed,
                  account: result.response.account,
                  synchronized: result.response.synchronized
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/listpermissions provides the information of each address permissions information
router.post('/api/v1/listpermissions', common.checkToken, (req, res) => {
  common.validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        listpermissions
          .listpermissions(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                primechain_address: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/entity_transaction_list returns the users transactions history by providing public address
router.post('/api/v1/entity_transaction_list', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        entity_transaction_list
          .entity_transaction_list(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                entity_transaction_list: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/create_entity this api will create new public address. 
router.post('/api/v1/create_entity', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let external_key_management = req.body.external_key_management;
      let generate_rsa_keys = req.body.generate_rsa_keys;
      if (!external_key_management.toString() || !generate_rsa_keys.toString()) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_entity
          .create_entity(external_key_management, generate_rsa_keys)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                primechain_address: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/list_entities this api will return public address present in blockchain
router.get('/api/v1/list_entities', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      list_entities
        .list_entities()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              primechain_address: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/grant_permissions this api will grant permission for the newaddress.
router.post('/api/v1/manage_permissions', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let permission = req.body.permission;
      let action = req.body.action;

      if (!primechain_address || !permission || !action) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        manage_permissions
          .manage_permissions(primechain_address, permission, action)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/verify_permissions', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let permission = req.body.permission;

      if (!primechain_address || !permission) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        verify_permissions
          .verify_permissions(primechain_address, permission)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                exists: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// ------------------------ Asset Endpoints --------------------------

// api/v1/create_token creates a new asset 
router.post('/api/v1/create_token', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let from_address = req.body.from_address;
      let to_address = req.body.to_address;
      let asset = req.body.asset;
      let quantity = req.body.quantity;
      let unit = req.body.unit;
      let details = req.body.details;
      if (!from_address || !to_address || !asset || !quantity || !unit || !details) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_token
          .create_token(from_address, to_address, asset, quantity, unit, details)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response,
                asset_ref: result.assetref,
                description: result.details
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v-1.0/asset_create_more_from issues more quantity on same asset
router.post('/api/v1/create_more_token', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let from_address = req.body.from_address;
      let to_address = req.body.to_address;
      let asset_name = req.body.asset_name;
      let quantity = req.body.quantity;

      if (!from_address || !to_address || !asset_name || !quantity) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_more_token
          .create_more_token(from_address, to_address, asset_name, quantity)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(401)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/get_asset_info', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        get_asset_info
          .get_asset_info(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.query
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/asset_details returns asset information 
router.post('/api/v1/asset_details', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let asset_name = req.body.asset_name;

      if (!asset_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        asset_details
          .asset_details(asset_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/asset_balances return asset balance of provided asset
router.get('/api/v1/asset_balances', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      asset_balances
        .asset_balances()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              asset_balance: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

//api/v1/send_asset_from can transfer the asset with amount from one address to another address
router.post('/api/v1/send_asset', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let from_address = req.body.from_address;
      let to_address = req.body.to_address;
      let asset_name = req.body.asset_name;
      let quantity = req.body.quantity;
      let details = req.body.details;

      if (!from_address || !to_address || !asset_name || !quantity || !details) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        send_asset
          .send_asset(from_address, to_address, asset_name, quantity, details)

          .then(result => {
            res.status(result.status).json({
              status: result.status,
              tx_id: result.response,
            });
          })
          .catch(err => {
            res
              .status(401)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});
// listAssetTransactions

//api/v1/send_asset can transfer the asset with amount from one address to another address
router.post('/api/v1/asset_transaction_list', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let asset_name = req.body.asset_name;

      if (!asset_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        asset_transaction_list
          .list_asset_transactions(asset_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                transaction_list: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});
// api/v1/wallet_transactions returns wallet transaction detail by providing the count
router.post('/api/v1/wallet_transactions', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let count = req.body.count;
      let number = parseInt(count);

      if (!number) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        wallet_transactions
          .wallet_transactions(number)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                wallet_transactions: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/multi_balances returns balance of multiple addresses.
router.post('/api/v1/assets_held_by_entity', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        assets_held_by_entity
          .assets_held_by_entity(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/address_transaction returns transaction history of provided address
router.post('/api/v1/address_transaction', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        address_transaction
          .address_transaction(primechain_address)
          .then(result => {
            res
              .status(200)
              .json({
                status: result.status,
                address_transaction: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/address_balances returns balance of given address
router.post('/api/v1/address_balances', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        address_balances
          .address_balances(primechain_address)
          .then(result => {
            res
              .status(200)
              .json({
                status: result.status,
                address_balances: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// /api/v1/create_trade_channel create a stream
router.post('/api/v1/create_trade_channel', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let trade_channel_name = req.body.trade_channel_name;
      let trade_channel_details = req.body.trade_channel_details;
      let open = req.body.open;

      if (!primechain_address || !trade_channel_name || !trade_channel_details) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_trade_channel
          .create_trade_channel(primechain_address, trade_channel_name, trade_channel_details, open)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              })
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/list_data_streams returns all the streams present in a blockchain network
router.get('/api/v1/list_data_streams', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      list_data_streams
        .list_data_streams()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              stream_details: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/grant grants permission send recieve as well write permission
router.post('/api/v1/grant_write_permission_to_trade_channel', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let trade_channel_writer = req.body.trade_channel_writer;
      let trade_channel_name = req.body.trade_channel_name;
      let trade_channel_creator = req.body.trade_channel_creator;

      if (!trade_channel_writer || !trade_channel_name || !trade_channel_creator) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        grant_write_permission_to_trade_channel
          .grant_write_permission_to_trade_channel(trade_channel_writer, trade_channel_name, trade_channel_creator)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// revoke_write_permission_to_stream
router.post('/api/v1/revoke_write_permission_to_trade_channel', common.checkToken, (req, res) => {
  common.validateAPIKey(req, res)
    .then(() => {
      let trade_channel_writer = req.body.trade_channel_writer;
      let trade_channel_name = req.body.trade_channel_name;
      let trade_channel_creator = req.body.trade_channel_creator;

      if (!trade_channel_writer || !trade_channel_name || !trade_channel_creator) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        revoke_write_permission_to_trade_channel
          .revoke_write_permission_to_trade_channel(trade_channel_writer, trade_channel_name, trade_channel_creator)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/subscribe subscribes stream / asset
router.post('/api/v1/subscribe', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let stream_name = req.body.stream_name;

      if (!stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        subscribe
          .subscribe(stream_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/unsubscribe unsubscribe stream / asset
router.post('/api/v1/unsubscribe', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let stream_name = req.body.stream_name;

      if (!stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        unsubscribe
          .unsubscribe(stream_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/list_stream_items_by_key returns data of given key
router.post('/api/v1/list_trade_channel_items_by_key', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let key = req.body.key;
      let trade_channel_name = req.body.trade_channel_name;

      if (!key || !trade_channel_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        list_trade_channel_items_by_key
          .list_trade_channel_items_by_key(key, trade_channel_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/list_stream_keys returns all the keys present in a stream
router.post('/api/v1/list_stream_keys', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let stream_name = req.body.stream_name;

      if (!stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        list_stream_keys
          .list_stream_keys(stream_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/list_stream_items returns all the keys present in a stream
router.post('/api/v1/list_stream_items', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let stream_name = req.body.stream_name;
      let count = req.body.count;
      let index = req.body.index;

      if (!stream_name || !count.toString() || !index.toString()) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        list_stream_items
          .list_stream_items(stream_name, count, index)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/liststreampublisheritems retruns data present in a stream for a particular public address
router.post('/api/v1/list_trade_channel_items_by_publisher', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let trade_channel_name = req.body.trade_channel_name;

      if (!primechain_address || !trade_channel_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        list_trade_channel_items_by_publisher
          .list_trade_channel_items_by_publisher(primechain_address, trade_channel_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.get('/api/v1/list_all_asset', common.checkToken, (req, res) => {
  common.validateAPIKey(req, res)
    .then(() => {
      list_all_asset
        .list_all_asset()
        .then(result => {
          res
            .status(result.status)
            .json({
              status: result.status,
              response: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/create_signer will return an address
router.get('/api/v1/create_signer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      create_signer
        .create_signer()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              address: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/create_signature will sign a messsage and return hash out of it
router.post('/api/v1/create_signature', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = (!req.body.primechain_private_key) ? req.body.primechain_address : req.body.primechain_private_key;
      let hash = req.body.data;
      let save_to_great = req.body.save_to_great;
      if (!primechain_address || !hash || !save_to_great.toString()) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_signature
          .create_signature(primechain_address, hash, save_to_great)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                signature: result.signature,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/verify_signature will verify hash and message and return true
router.post('/api/v1/verify_signature', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let signature = req.body.signature;
      let message = req.body.data;

      if (!primechain_address || !signature || !message) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        verify_signature
          .verify_signature(primechain_address, signature, message)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/create_save_signature will save signature
router.post('/api/v1/create_save_signature', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let hash = req.body.data;

      if (!primechain_address || !hash) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_save_signature
          .create_save_signature(primechain_address, hash)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: {
                  tx_id: result.response,
                  signature: result.signature
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/get_from_great', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let hash = req.body.data;

      if (!hash) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        get_from_great
          .get_from_great(hash)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response,
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});


// api/v1/encrypt_sign_store_data will encrypt the file and store
router.post('/api/v1/encrypt_sign_store_file', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let file_data = (req.files) ? req.files.file : req.body.file;
      let stream_name = req.body.stream_name;

      if (!primechain_address || !file_data || !stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        encrypt_sign_store_file
          .encrypt_sign_store_file(primechain_address, file_data, stream_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: {
                  tx_id_enc_file: result.response,
                  tx_id_signature: result.response_sign,
                  signature: result.signature,
                  aes_password: result.password,
                  aes_iv: result.iv
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/encrypt_sign_store_data', common.checkToken, (req, res) => {
  common.validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let data = req.body.data;
      let stream_name = req.body.stream_name;

      if (!primechain_address || !data || !stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        encrypt_sign_store_data
          .encrypt_sign_store_data(primechain_address, data, stream_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: {
                  tx_id_enc_data: result.response,
                  tx_id_signature: result.response_sign,
                  signature: result.signature,
                  aes_password: result.password,
                  aes_iv: result.iv,
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/decrypt_download_data will decrypt the file and download 
router.post('/api/v1/decrypt_download_file', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id_enc_file;
      let tx_id_sign = req.body.tx_id_signature;
      let key = req.body.aes_password;
      let iv = req.body.aes_iv;
      let stream_name = req.body.stream_name;

      if (!tx_id || !tx_id_sign || !key || !iv || !stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        decrypt_download_file
          .decrypt_download_file(tx_id, tx_id_sign, key, iv, stream_name)
          .then(result => {
            // res.writeHead(200, {
            //   'Content-Type': result.decrypted_data_json["mimetype"],
            //   'Content-disposition': 'inline;filename=' + result.decrypted_data_json["name"],
            //   'Content-disposition': 'attachment;filename=' + result.decrypted_data_json["name"],
            //   'Content-Length': result.file_data.length
            // });

            // res.end(result.file_data);

            res
              .status(200)
              .json({
                status: result.status,
                file_data: result.file_data,
                decrypted_data_json: result.decrypted_data_json,
                signature_status: result.signature_status,
                signer_detail: result.details
              });
          })
          .catch(err => {
            res.status(err.status).json({
              status: err.status,
              message: err.message
            })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/decrypt_download_data', common.checkToken, (req, res) => {
  common.validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id_enc_data;
      let tx_id_sign = req.body.tx_id_signature;
      let key = req.body.aes_password;
      let iv = req.body.aes_iv;
      let stream_name = req.body.stream_name;

      if (!tx_id || !tx_id_sign || !key || !iv || !stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        decrypt_download_data
          .decrypt_download_data(tx_id, tx_id_sign, key, iv, stream_name)
          .then(result => {
            res
              .status(200)
              .json({
                status: result.status,
                response: {
                  data: result.response,
                  signer_detail: result.details,
                  signature_status: result.signature_status
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: 'Internal Server Error'
        });
    });
});

router.post('/api/v1/decrypt_download_data_pdf', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id_enc_data;
      let tx_id_sign = req.body.tx_id_signature;
      let key = req.body.aes_password;
      let iv = req.body.aes_iv;

      if (!tx_id || !tx_id_sign || !key || !iv) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        decrypt_download_data_pdf
          .decrypt_download_data_pdf(tx_id, tx_id_sign, key, iv)
          .then(result => {
            // return res.status(200).json({
            //   status: result.status,
            //   response: result.data
            // });
            res.end(result.data);
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: 'Internal Server Error'
        });
    });
});

router.post('/api/v1/get_data', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id_enc_data;
      let tx_id_sign = req.body.tx_id_signature;
      let key = req.body.aes_password;
      let iv = req.body.aes_iv;
      let trade_channel_name = req.body.trade_channel_name;

      if (!tx_id || !tx_id_sign || !key || !iv || !trade_channel_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        get_data.
          get_data(tx_id, tx_id_sign, key, iv, trade_channel_name)
          .then(result => {
            res
              .status(200)
              .json({
                status: result.status,
                response: {
                  data: result.response,
                  primechain_address: result.primechain_address,
                  signature_status: result.signature_status,
                  timestamp: result.timestamp
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/write_to_stream will store the data with particular stream
router.post('/api/v1/write_to_stream', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address_stream_writer = req.body.primechain_address_stream_writer;
      let key = req.body.key;
      let value = req.body.value;
      let stream = req.body.stream;

      if (!primechain_address_stream_writer || !key || !value || !stream) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        write_to_stream
          .write_to_stream(primechain_address_stream_writer, key, value, stream)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/publish_data', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let data = req.body.data;
      let keys = req.body.keys;
      let primechain_address = req.body.primechain_address;
      let trade_channel_name = req.body.trade_channel_name;

      if (!data || !keys || !primechain_address || !trade_channel_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        publish_data
          .publish_data(primechain_address, data, keys, trade_channel_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// api/v1/connect_node can connect other nodes 
router.post('/api/v1/connect_node', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let ip_address = req.body.ip_address;
      let commands = req.body.commands;

      if (!ip_address || !commands) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        connect_node
          .connect_node(ip_address, commands)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
})

// ----------------- offer management api ---------------------------

// api/v1/create_offer creates an atomic exchange offer
router.post('/api/v1/create_targeted_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let from_address = req.body.from_address;
      let to_address = req.body.to_address;
      let ask_asset = req.body.ask_asset;
      let offer_asset = req.body.offer_asset;

      if (!from_address || !to_address || !ask_asset || !offer_asset) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_targeted_offer
          .create_targeted_offer(from_address, to_address, ask_asset, offer_asset)

          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: {
                  tx_id: result.response.response,
                  offer_blob: result.offer_blob,
                  offer_tx_id: result.offer_txid,
                  offer_vout: result.offer_vout
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/create_public_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let ask_asset = req.body.ask_asset;
      let offer_asset = req.body.offer_asset;

      console.log(primechain_address, ask_asset, offer_asset);

      if (!primechain_address || !ask_asset || !offer_asset) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_public_offer
          .create_public_offer(primechain_address, ask_asset, offer_asset)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: {
                  tx_id: result.response.response,
                  offer_blob: result.offer_blob,
                  offer_tx_id: result.offer_txid,
                  offer_vout: result.offer_vout
                }
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// /api/v1/accept_offer accepts an request of atomic exchange of asset
router.post('/api/v1/accept_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let offer_blob = req.body.offer_blob;

      if (!primechain_address || !offer_blob) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        accept_offer
          .accept_offer(offer_blob, primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// /api/v1/read_offer decodes hex blob
router.post('/api/v1/read_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let offer_blob = req.body.offer_blob;

      if (!offer_blob) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        read_offer
          .read_offer(offer_blob)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
})

// /api/v1/get_my_offer returns asked offer for particular address
router.post('/api/v1/get_targeted_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let to_address = req.body.to_address;

      if (!to_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        get_targeted_offer
          .get_targeted_offer(to_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/get_open_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        get_open_offer
          .get_open_offer(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// router.post('/api/v1/get_all_open_offer', common.checkToken, (req, res) => {
//   common
//     .validateAPIKey(req, res)
//     .then(() => {
//       get_all_open_offer
//         .get_all_open_offer()
//         .then(result => {
//           res
//             .status(result.status)
//             .json({
//               status: result.status,
//               response: result.response
//             });
//         })
//         .catch(err => {
//           res
//             .status(err.status)
//             .json({
//               status: err.status,
//               message: err.message
//             })
//         });
//     })
//   .catch(err => {
//     res
//       .status(401)
//       .json({
//         status: 401,
//         message: err_code.errorcode["13030"]
//       });
//   });
// });

// api/v1/reject_offer rejects an request of atomic exchange of asset
router.post('/api/v1/reject_targeted_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id;
      let primechain_address = req.body.primechain_address;

      if (!tx_id || !primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        reject_targeted_offer
          .reject_targeted_offer(tx_id, primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// /api/v1/cancel_offer cancel atomic exchange offer.
router.post('/api/v1/cancel_public_offer', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id;
      let primechain_address = req.body.primechain_address;

      if (!tx_id || !primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        cancel_public_offer
          .cancel_public_offer(tx_id, primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              })
          }).catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// ---------------------------------- non blockchain API -----------------------------------------

// api/v1/uuid returns a unique random string 
router.get('/api/v1/uuid', (req, res) => {
  uuid
    .uuid()
    .then(result => {
      res
        .status(200)
        .json({
          uuid: result.response
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
})

// api/v1/get_password returns a random string with various combination & length
router.get('/api/v1/get_password', (req, res) => {
  get_password
    .get_password()
    .then(result => {
      res
        .status(200)
        .json({
          simple_8_character: result.simple_password_8,
          complex_8_character: result.complex_password_8,
          simple_20_character: result.simple_password_20,
          complex_20_character: result.complex_password_20,
          simple_32_character: result.simple_password_32,
          complex_32_character: result.complex_password_32,
          simple_40_character: result.simple_password_40,
          complex_40_character: result.response
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.get('/api/v1/create_string_timestamp', (req, res) => {
  create_string_timestamp
    .create_string_timestamp()
    .then(result => {
      res
        .status(200)
        .json({
          status: result.status,
          response: result.response
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});


//-------------------- download excelsheet Api------------------------

router.get('/api/v1/download_blockchain_info', (req, res) => {
  bcsdk
    .getBlockchainParams()
    .then(res => {
      let xls = json2xls(res.response);

      fs
        .writeFileSync('excelsheet/Excel.xlsx', xls, 'binary');

      let file = __dirname + '/excelsheet/Excel.xlsx';
      res.download(file);
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// ----------------------- On-boarding a user---------------------------------------

router.post('/api/v1/onboard_user', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let user_identifier = req.body.user_identifier;
      let user_description = req.body.user_description;

      if (!user_identifier || !user_description) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        onboard_user
          .onboard_user(user_identifier, user_description)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          }).catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/get_rsa_key', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        get_rsa_key
          .get_rsa_key(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                rsa_public_key: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/list_onboarded_user_details', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        list_onboarded_user_details
          .list_onboarded_user_details(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/login_request', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;

      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        login_request
          .login_request(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/session_key_auth', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_private_key = req.body.primechain_private_key;
      let session_key = req.body.session_key;

      if (!primechain_private_key || !session_key) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        session_key_auth
          .session_key_auth(primechain_private_key, session_key)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// ---------------------------  secure communication API's -------------------------------

router.post('/api/v1/comm_create', (req, res) => {
  let sender_address = req.body.sender_address;
  let receiver_address = req.body.receiver_address;
  let message = req.body.message;

  if (!sender_address || !receiver_address || !message) {
    res
      .status(422)
      .json({
        message: 'Missing inputs'
      });
  } else {
    comm_create
      .comm_create(sender_address, receiver_address, message)
      .then(result => {
        res
          .status(result.status)
          .json({
            status: result.status,
            response: result.response
          })
      })
      .catch(err => {
        res
          .status(err.status)
          .json({
            status: err.status,
            message: err.message
          })
      });
  }
});
// ------------------------------ transfer asset -----------------------------------------
router.post('/api/v1/transfer_asset', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let senders_address = req.body.senders_address;
      let receivers_address = req.body.receivers_address;
      let asset_name = req.body.asset_name;
      let asset_quantity = req.body.asset_quantity;
      let senders_private_key = req.body.senders_private_key;

      if (!senders_address || !receivers_address || !asset_name || !asset_quantity || !senders_private_key) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        transfer_asset
          .transfer_asset(senders_address, receivers_address, asset_name, asset_quantity, senders_private_key)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/transfer_multisign_asset', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let senders_address = req.body.senders_address;
      let receivers_address = req.body.receivers_address;
      let asset_name = req.body.asset_name;
      let asset_quantity = req.body.asset_quantity;
      let senders_private_key = req.body.senders_private_key;

      if (!senders_address || !receivers_address || !asset_name || !asset_quantity || !senders_private_key) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        transfer_multisign_asset
          .transfer_multisign_asset(senders_address, receivers_address, asset_name, asset_quantity, senders_private_key)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

// ---------------------------------------   Invoice API's    -----------------------------------------------------
router.post('/api/v1/create_invoice', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let invoice_payer = req.body.invoice_payer;
      let invoice_payee = req.body.invoice_payee;
      let invoice_name = req.body.invoice_name;
      let invoice_details = req.body.invoice_details;

      if (!invoice_payer || !invoice_payee || !invoice_name || !invoice_details) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_invoice
          .create_invoice(invoice_payer, invoice_payee, invoice_name, invoice_details)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/create_bid', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let from_address = req.body.from_address;
      let to_address = req.body.to_address;
      let invoice_reference_number = req.body.invoice_reference_number;
      let token = req.body.token;
      let token_amount = req.body.token_amount;

      if (!from_address || !to_address || !invoice_reference_number || !token || !token_amount) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_bid
          .create_bid(from_address, to_address, invoice_reference_number, token, token_amount)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/cancel_bid', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id;

      if (!tx_id) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        cancel_bid
          .cancel_bid(tx_id)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.get('/api/v1/view_all_bids', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      view_all_bids
        .view_all_bids()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              all_bid_details: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            })
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});
// /api/v1/view_bid
router.post('/api/v1/view_bid', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let invoice_reference_number = req.body.invoice_reference_number;

      if (!invoice_reference_number) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        view_bid
          .view_bid(invoice_reference_number)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              })
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/reject_bid', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id;
      let address = req.body.primechain_address;

      if (!tx_id || !address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        reject_bid
          .reject_bid(tx_id, address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/accept_bid', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let tx_id = req.body.tx_id;
      let address = req.body.primechain_address;

      if (!tx_id || !address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        accept_bid
          .accept_bid(tx_id, address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/retire_invoice', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let invoice_reference_number = req.body.invoice_reference_number;

      if (!invoice_reference_number) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        retire_invoice
          .retire_invoice(invoice_reference_number)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.get('/api/v1/view_all_invoices', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      view_all_invoice
        .view_all_invoice()
        .then(result => {
          res
            .status(200)
            .json({
              status: result.status,
              all_invoices: result.response
            });
        })
        .catch(err => {
          res
            .status(err.status)
            .json({
              status: err.status,
              message: err.message
            });
        });
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/create_digital_id', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let keys = req.body.keys;
      let data = req.body.data;
      let stream_name = req.body.stream_name;

      if (!primechain_address || !keys || !data || !stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        create_digital_id
          .create_digital_id(primechain_address, keys, data, stream_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response,
                primechain_address: result.address
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/search_digital_id', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let key = req.body.key;
      let stream_name = req.body.stream_name;

      if (!key || !stream_name) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      } else {
        search_digital_id
          .search_digital_id(key, stream_name)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                digital_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });

          })
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });

});

// request_otp

router.post('/api/v1/request_otp', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      if (!primechain_address) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      } else {
        request_otp
          .request_otp(primechain_address)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                otp: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

router.post('/api/v1/retrieve_details', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let primechain_address = req.body.primechain_address;
      let otp = req.body.otp;
      if (!primechain_address || !otp) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      } else {
        retrieve_details
          .retrieve_details(primechain_address, otp)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                response: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});
router.post('/api/v1/update_digital_id', common.checkToken, (req, res) => {
  common
    .validateAPIKey(req, res)
    .then(() => {
      let employee_primechain_address = req.body.employee_primechain_address;
      let customer_primechain_address = req.body.customer_primechain_address;
      let data = req.body.data;
      if (typeof data != "object") {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Please provide data in object format'
          });
      }
      else if (!employee_primechain_address || !customer_primechain_address || !data) {
        res
          .status(422)
          .json({
            status: 422,
            message: 'Missing inputs'
          });
      }
      else {
        update_digital_id
          .update_digital_id(employee_primechain_address, customer_primechain_address, data)
          .then(result => {
            res
              .status(result.status)
              .json({
                status: result.status,
                tx_id: result.response
              });
          })
          .catch(err => {
            res
              .status(err.status)
              .json({
                status: err.status,
                message: err.message
              });
          });
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({
          status: 401,
          message: err_code.errorcode["13030"]
        });
    });
});

module.exports = router;
