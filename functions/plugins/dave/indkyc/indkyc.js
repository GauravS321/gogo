const APICall = require('../../../../helpers/request');

const indkyc = require('../../../../src/web/models/plugins/dave/indkyc');

const Mailer = require('../../../../helpers/mailer');

module.exports.issue = (primechain_address, json) => {
    return new Promise(async (resolve, reject) => {
        try {
            const keys = [json["Account no"], json["Full name"], json["Date of birth"], json["Father's name"], json["Mobile number"]];

            let trade_channel_name = json.trade_channel_name;

            let data = json;

            delete data['trade_channel_name'];

            let response = await APICall.httpPostMethod('publish_data', {
                primechain_address,
                keys,
                data,
                trade_channel_name
            });

            if (response.status === 200) {

                let newRecord = new indkyc({
                    keys,
                    tx_id_enc_data: response.response['tx_id_enc_data'],
                    tx_id_signature: response.response['tx_id_signature'],
                    aes_password: response.response['aes_password'],
                    aes_iv: response.response['aes_iv'],
                    trade_channel_name
                });

                await newRecord.save();

                resolve({
                    status: 200,
                    msg: response.response
                });
            }
            else {
                reject({
                    status: 500,
                    error: response.message
                });
            }
        } catch (error) {
            reject({
                status: 500,
                message: error.message
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

            await Mailer.individualKYCMail(sender_mail, recevier_name, receiver_email, use_case, path)

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
