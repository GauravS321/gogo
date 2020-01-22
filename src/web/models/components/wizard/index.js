const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const WizardSchema = new Schema({
    json: Object
}, { timestamps: true });

const Wizard = mongoose.model('wizard', WizardSchema);

module.exports = Wizard;
