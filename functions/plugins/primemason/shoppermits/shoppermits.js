const uuidv1 = require('uuid/v1');

const APICall = require('../../../../helpers/request');

const shoppermits = require('../../../../src/web/models/plugins/primemason/shoppermits');

const Mailer = require('../../../../helpers/mailer');

module.exports.create = (json) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newrecord = new shoppermits({
                uuid: uuidv1(),
                json
            });

            let response = await newrecord.save();

            return resolve({
                status: 200,
                msg: response
            });
        } catch (error) {
            return reject({
                status: 401,
                error: error
            });
        }
    });
}

module.exports.retrieve = (json) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tx_id_enc_data = json.txid_data.trim();
            const tx_id_signature = json.txid_signature.trim();
            const aes_password = json.password.trim();
            const aes_iv = json.iv.trim();
            const trade_channel_name = json.trade_channel_name.trim();

            let apiBody = {
                tx_id_enc_data,
                tx_id_signature,
                aes_password,
                aes_iv,
                trade_channel_name
            };

            let response = await APICall.httpPostMethod('get_data', apiBody)

            if (response.status === 200) {
                return resolve({
                    status: 200,
                    msg: response.response
                });
            }
            else {
                return reject({
                    status: 500,
                    error: response.message
                });
            }
        } catch (error) {
            return reject({
                status: 500,
                message: error.message
            });
        }
    });
}

module.exports.share = (sender_mail, recevier_name, receiver_email, body, use_case) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tx_id_enc_data = body.txid_data.trim();
            const tx_id_signature = body.txid_signature.trim();
            const aes_password = body.password.trim();
            const aes_iv = body.iv.trim();
            const trade_channel_name = body.trade_channel_name.trim();

            const path = `txid_data=${tx_id_enc_data}&txid_signature=${tx_id_signature}&password=${aes_password}&iv=${aes_iv}&trade_channel_name=${trade_channel_name}`;

            await Mailer.shareVerificationMail(sender_mail, recevier_name, receiver_email, use_case, path)

            return resolve({
                status: 200,
                msg: "Email sent successfully!!!"
            });
        } catch (error) {
            return reject({
                status: 500,
                message: error.message
            });
        }
    });
}
