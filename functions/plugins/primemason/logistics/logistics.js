const uuidv1 = require('uuid/v1');

const logistics = require('../../../../src/web/models/plugins/primemason/logistics');

const Mailer = require('../../../../helpers/mailer');

module.exports.create = (json) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newrecord = new logistics({
                uuid: uuidv1(),
                json
            });

            let response = await newrecord.save();

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


module.exports.share = (sender_mail, recevier_name, receiver_email, uuid, use_case) => {
    return new Promise(async (resolve, reject) => {
        try {
            const path = `uuid=${uuid}`;

            await Mailer.shareLogisticsPrimeMasonMail(sender_mail, recevier_name, receiver_email, use_case, path)

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
