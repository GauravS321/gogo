const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const WizardSchema = new Schema({
    json: Object
}, { timestamps: true });

<<<<<<< HEAD
const Wizard = mongoose.model('wizard', WizardSchema);

module.exports = Wizard;
=======
const Wizards = mongoose.model('wizard', WizardSchema);

module.exports = Wizards;
>>>>>>> master
