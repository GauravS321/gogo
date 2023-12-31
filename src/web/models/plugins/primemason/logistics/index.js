const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

var counter = mongoose.model('logisticscounter', CounterSchema);

const logisticsSchema = new mongoose.Schema({
    document_id: { type: String },
    uuid: String,
    json: Object,
    inputs: Array
}, { timestamps: true });


logisticsSchema.pre('save', function save(next) {
    var doc = this;

    counter.findByIdAndUpdate({ _id: 'document_id' }, { $inc: { seq: 1 } }, { upsert: true, new: true }, (err, count) => {
        if (err) return next(err);
        doc.document_id = count.seq;
        next();
    })
})

module.exports = mongoose.model('logistics', logisticsSchema);

