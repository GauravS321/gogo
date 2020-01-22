// AUTH_USERS_MASTERLIST

var bcSdk = require('multichainsdk');
const NodeRSA = require('node-rsa');
const keys = new NodeRSA();
// const request = require('superagent');

exports.comm_create = (sender_address, receiver_address, message) => {
    return new Promise(async function (resolve, reject) {

        let get_public_key = await bcSdk.listStreamKeyItemsStream({
            key: receiver_address,
            stream: "AUTH_USERS_MASTERLIST"
        }).then((get_public_key) => {
            let parse_output = JSON.parse(get_public_key.response[0].data)
            const key = new NodeRSA(parse_output.rsa_public_key);
            const encrypted = key.encrypt(message, 'base64');
            bcSdk.signMessage({
                address: sender_address,
                message: message
            }).then((res) => {
                let data = {
                    sender_address: sender_address,
                    encrypted_data: encrypted,
                    signature: res.response
                }
                // request.post(`http://localhost:2512/api/v1/encrypt_data_rsa`)
                //     .send(data)
                //     .set('Accept', 'application/json')
                //     .then(res => {
                //         return resolve({
                //             status: res.status,
                //             response: res.body
                //         });
                //     })
                //     .catch(err => {
                //         return reject({
                //             status: 401,
                //             response: err.message
                //         });
                //     });
            })


        }).catch((err) => {
            return reject({
                status: 401,
                message: err.message
            })
        })
    })
};