const validator = require('validator');
const passport = require('passport');

<<<<<<< HEAD
// Activity log function call
const ActivityLogs = require('../../../functions/users/account/activity-logs');
module.exports.authenticate = (req, res, next, email, password) => {
    return new Promise(async (resolve, reject) => {
=======
/**
 * POST /login
 * Sign in using email and password.
 */
exports.authenticate = (req, res, email, password, next) => {
    return new Promise((resolve, reject) => {
>>>>>>> master
        try {
            const validationErrors = [];

            if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
            if (validator.isEmpty(password)) validationErrors.push({ msg: 'Password cannot be blank.' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }
<<<<<<< HEAD

            email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
=======
            email = validator.normalizeEmail(email, { gmail_remove_dots: false });
>>>>>>> master

            passport.authenticate('local', (err, user) => {
                if (err) {
                    return reject({
                        status: 401,
<<<<<<< HEAD
                        message: "Authentication failed"
=======
                        message: err
>>>>>>> master
                    });
                }

                if (!user) {
                    return reject({
                        status: 401,
<<<<<<< HEAD
                        message: "Invalid e-mail address"
=======
                        message: "Authentication failed"
>>>>>>> master
                    });
                }
                req.logIn(user, async (err) => {
                    if (err) {
                        return reject({
                            status: 401,
<<<<<<< HEAD
                            message: "Failed to login user"
                        });
                    }

                    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    ip_arr = ip.split(':');
                    ip = ip_arr[ip_arr.length - 1];

                    let browser = req.headers['user-agent'];

                    await ActivityLogs.create(email, ip, browser);

=======
                            message: "Authentication failed"
                        });
                    }

>>>>>>> master
                    return resolve({
                        status: 200,
                        msg: true
                    });
                });
            })(req, res, next);
        } catch (error) {
            return reject({
                status: 500,
<<<<<<< HEAD
                message: error
            })
        }
    });
}
=======
                message: "Internal server error!!!"
            });
        }
    });
};
>>>>>>> master
