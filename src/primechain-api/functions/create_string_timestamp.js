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
 * @description : This function returns a random string with merging timestamp with it.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');
var randomString = require('random-string');
var crypto = require('crypto');

exports.create_string_timestamp = () => {
    return new Promise(async function (resolve, reject) {
        var random_string = await randomString({
            length: 512,
            numeric: true,
            letters: true
        });
        var today = new Date();
        var str = today.toUTCString();
        let date_time = new Date(str).getTime() / 1000
        let concat = random_string + '^' + date_time;
        let generate_hash = crypto.createHash('sha512').update(concat).digest('hex');

        return resolve({
            status: 200,
            response: {
                string: random_string,
                timestamp: date_time,
                hash: generate_hash
            }
        })
    })
};