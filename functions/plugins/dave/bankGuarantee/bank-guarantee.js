const APICall = require('../../../../helpers/request');
const BankGuarantee = require('../../../../models/bank_guarantee');
const Mail = require('../../../../helpers/sendgrid');

module.exports.issue = (primechain_address, json) => {
    return new Promise(async (resolve, reject) => {
        try {
            const keys = [json.guarantee_number, json.date_issue, json.guarantee_currency, json.guarantee_amount_figures, json.guarantee_beneficiary];

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

                let newBankGuarantee = new BankGuarantee({
                    keys,
                    tx_id_enc_data: response.response['tx_id_enc_data'],
                    tx_id_signature: response.response['tx_id_signature'],
                    aes_password: response.response['aes_password'],
                    aes_iv: response.response['aes_iv'],
                    trade_channel_name
                })

                await newBankGuarantee.save();

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

module.exports.share = (sender_mail, recevier_name, receiver_email, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tx_id_enc_data = body.txid_data.trim();
            const tx_id_signature = body.txid_signature.trim();
            const aes_password = body.password.trim();
            const aes_iv = body.iv.trim();
            const trade_channel_name = body.trade_channel_name.trim();

            const path = `verification?txid_data=${tx_id_enc_data}&txid_signature=${tx_id_signature}&password=${aes_password}&iv=${aes_iv}&trade_channel_name=${trade_channel_name}`;

            await Mail.shareVerificationMail(sender_mail, recevier_name, receiver_email, path)

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
