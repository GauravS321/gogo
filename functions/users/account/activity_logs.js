const ActivityLogs = require('../../../models/components/account/activity_logs');

exports.create = (email, ip, browser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newLog = new ActivityLogs({
                email,
                ip,
                browser
            });

            await newLog.save();
            
            return resolve({
                status: 200,
                msg: true
            });
        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}

exports.read = (email) => {
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
                error: error
            });
        }
    });
}