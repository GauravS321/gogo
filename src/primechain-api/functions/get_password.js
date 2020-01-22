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
 * @description : This function generates random strings.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var randomString = require('random-string');

exports.get_password = () => {
    return new Promise(async function (resolve, reject) {

        var simple_password_8 = await randomString({
            length: 8,
            numeric: true,
            letters: true
        })

        var complex_password_8 = await randomString({
            length: 8,
            numeric: true,
            letters: true,
            special: true,
            exclude: ['.', '<', '>', '?', '`', ';', '=', '{', '~', '[', '+', '=', '(', ')', '[', ']', '|', '}', '_', '/', ',', ':']
        })

        var simple_password_20 = await randomString({
            length: 20,
            numeric: true,
            letters: true
        })

        var complex_password_20 = await randomString({
            length: 20,
            numeric: true,
            letters: true,
            special: true,
            exclude: ['.', '<', '>', '?', '`', ';', '=', '{', '~', '[', '+', '=', '(', ')', '[', ']', '|', '}', '_', '/', ',', ':']
        })

        var simple_password_32 = await randomString({
            length: 32,
            numeric: true,
            letters: true
        })

        var complex_password_32 = await randomString({
            length: 32,
            numeric: true,
            letters: true,
            special: true,
            exclude: ['.', '<', '>', '?', '`', ';', '=', '{', '~', '[', '+', '=', '(', ')', '[', ']', '|', '}', '_', '/', ',', ':']
        })

        var simple_password_40 = await randomString({
            length: 40,
            numeric: true,
            letters: true
        })
        var complex_password_40 = await randomString({
            length: 40,
            numeric: true,
            letters: true,
            special: true,
            exclude: ['.', '<', '>', '?', '`', ';', '=', '{', '~', '[', '+', '=', '(', ')', '[', ']', '|', '}', '_', '/', ',', ':']
        })

        return resolve({
            status: 200,
            simple_password_8: simple_password_8,
            complex_password_8: complex_password_8,
            simple_password_20: simple_password_20,
            complex_password_20: complex_password_20,
            simple_password_32: simple_password_32,
            complex_password_32: complex_password_32,
            simple_password_40: simple_password_40,
            response: complex_password_40
        })
    })
};