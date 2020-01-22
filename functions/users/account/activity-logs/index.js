const ActivityLogs = require('../../../../src/web/models/users/activity-logs');

module.exports.create = (email, ip, browser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newActivity = new ActivityLogs({
                email,
                ip,
                browser
            });

            await newActivity.save();

            return resolve({
                status: 200,
                msg: true
            });
        } catch (error) {
            return reject({
                status: 500,
                message: error
            });
        }
    });
}

module.exports.read = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const loginDetails = await ActivityLogs
                .find({ email })
                .sort({
                    timestamp: -1
                });

            return resolve({
                status: 200,
                msg: loginDetails
            });
        } catch (error) {
            return reject({
                status: 500,
                message: error
            });
        }
    });
}