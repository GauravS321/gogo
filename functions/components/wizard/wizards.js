const Wizards = require('../../../models/wizards');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.create = (json) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newWizard = new Wizards({
                json
            });

            let response = await newWizard.save();

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

module.exports.read = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await Wizards.find();
            return resolve({
                status: 200,
                msg: data
            });
        } catch (error) {
            return reject({
                status: 401,
                error: error
            });
        }
    });
}

module.exports.deleteData = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Wizards.findByIdAndDelete({ _id: ObjectId(id) });

            return resolve({
                status: 200,
                msg: "ture"
            });
        } catch (error) {
            return reject({
                status: 401,
                error: error
            });
        }
    });
}

module.exports.getById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await Wizards.findOne({ _id: ObjectId(id) });
            return resolve({
                status: 200,
                msg: data
            });
        } catch (error) {
            return reject({
                status: 401,
                error: error
            });
        }
    });
}

module.exports.updateData = (json) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = json['id']
            delete json['id'];
            await Wizards.findOneAndUpdate({ _id: ObjectId(id) }, { json });
            return resolve({
                status: 200,
                msg: "Record updated"
            });
        } catch (error) {
            return reject({
                status: 401,
                error: error
            });
        }
    });
}