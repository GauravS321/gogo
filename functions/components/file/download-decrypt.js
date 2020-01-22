const validator = require('validator');
const APICall = require('../../../helpers/request');

module.exports = (tx_id_enc_file, tx_id_signature, aes_password, aes_iv, stream_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(tx_id_enc_file)) validationErrors.push({ msg: 'Transaction Id of the encrypted data is missing' })
            if (!validator.isLength(tx_id_signature)) validationErrors.push({ msg: 'Transaction Id of the signature is missing' });
            if (!validator.isLength(aes_password)) validationErrors.push({ msg: 'Password is missing' });
            if (!validator.isLength(aes_iv)) validationErrors.push({ msg: 'IV is missing' });
            if (!validator.isLength(stream_name)) validationErrors.push({ msg: 'Stream name  is missing' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            const response = await APICall.httpPostMethod('decrypt_download_file', {
                tx_id_enc_file,
                tx_id_signature,
                aes_password,
                aes_iv,
                stream_name
            });

            return resolve({
                status: 200,
                msg: response.decrypted_data_json

            });
        } catch (error) {
            return reject({
                status: 401,
                message: error
            });
        }
    });
}