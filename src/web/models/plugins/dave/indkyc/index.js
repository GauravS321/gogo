const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    keys: { type: Array },
    tx_id_enc_data: { type: String },
    tx_id_signature: { type: String },
    aes_password: { type: String },
    aes_iv: { type: String },
    trade_channel_name: { type: String }
}, { timestamps: true });


const indkyc = mongoose.model('indkyc', newSchema);

module.exports = indkyc;
