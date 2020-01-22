const publishPlainData = require('./upload_plain_data');
const downloadPlainData = require('./download_plain_data');
const publishEncryptedData = require('./encrypted_data');
const downloadDecryptedData = require('./decrypted_data');
const encryptFile = require('./encrypt_file');
const downloadFile = require('./download_file');


module.exports = {
    publishPlainData,
    downloadPlainData,
    publishEncryptedData,
    downloadDecryptedData,
    encryptFile,
    downloadFile
}