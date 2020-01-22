const mongoose = require('mongoose');

const bgSchema = new mongoose.Schema({
    keys: { type: Array },
    tx_id_enc_data: { type: String },
    tx_id_signature: { type: String },
    aes_password: { type: String },
    aes_iv: { type: String },
    trade_channel_name: { type: String }
}, { timestamps: true });

/**
 * Save
 */
bgSchema.pre('save', function save(next) {
    next();
});

const BankGuarantee = mongoose.model('bankGuarantee', bgSchema);

module.exports = BankGuarantee;