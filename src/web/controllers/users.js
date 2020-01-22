const validator = require('validator');
const passport = require('passport');

const User = require('../../../models/users');
const BankGuarantee = require('../../../models/bank_guarantee');
const ActivityLog = require('../../../models/activity_logs');

const administration = require('../../../functions/administration');
const permissions = require('../../../functions/permissions');
const esignature = require('../../../functions/esignature');
const account = require('../../../functions/account');
const dataStreams = require('../../../functions/dataStreams');
const sam = require('../../../functions/sam');
const dave = require('../../../functions/dave');
<<<<<<< HEAD
=======
const { create, read, getById, updateData, deleteData } = require('../../../functions/element');
const { issue, retrieve, share } = require('../../../functions/plugins/bankGuarantee');

// Get signup page

exports.getSignup = (req, res) => {
    return res.render('signup');
}

/**
* POST /signup
* Create a new local account.
*/
exports.postSignup = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;
        let response = await account.signup(email, username, password, confirm_password);

        req.flash('success_msg', response.msg);
        return res.redirect('/web');
    } catch (error) {
        if (error.errors) {
            req.flash('errors', error.errors);
            return res.redirect('/web');
        }
        else if (error.error) {
            req.flash('error_msg', error.error);
            return res.redirect('/web');
        }
        else {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/web');
        }
    }
};

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.redirect('/web/account/my-profile');
    }
    return res.redirect('login');

};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
    try {
        let { email, password } = req.body;
        const validationErrors = [];

        if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
        if (validator.isEmpty(password)) validationErrors.push({ msg: 'Password cannot be blank.' });

        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/web');
        }

        email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err); }

            if (!user) {
                req.flash('errors', info);
                return res.redirect('/web');
            }
            req.logIn(user, async (err) => {
                if (err) { return next(err); }

                let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                ip_arr = ip.split(':');
                ip = ip_arr[ip_arr.length - 1];

                let browser = req.headers['user-agent'];

                let newActivity = new ActivityLog({
                    email,
                    ip,
                    browser
                });

                await newActivity.save();

                req.flash('success_msg', 'Success! You are logged in.');
                return res.redirect('/web/account/my-profile');
            });
        })(req, res, next);
    } catch (error) {
        req.flash('error_msg', 'Internal server error!!!');
        return res.redirect('/web');
    }
};


exports.getLostPassword = (req, res) => {
    return res.render('lost_password');
}

exports.postLostPassword = async (req, res) => {
    try {
        const myURL = (req.headers.referer).split('/')[3];
        const { email } = req.body;
        const response = await account.lostPassword(email, myURL);

        req.flash('success_msg', response.msg);
        return res.redirect('/web');
    } catch (error) {
        console.log(error);

        if (error.errors) {
            req.flash('errors', error.errors);
            return res.redirect('/web');
        }
        else if (error.message) {
            req.flash('error_msg', error.message);
            return res.redirect('/web');
        }
        else {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/web');
        }
    }
};

// User reset password
exports.getResetPassword = async (req, res) => {
    if (Object.keys(req.query).length == 0) {
        req.flash('error_msg', 'Authentication failed');
        res.redirect('/web');
    }
    else {
        try {
            const { email_address, random } = req.query;
            let user = await User.findOne({
                email: email_address,
                passwordResetToken: random
            })
                .where('passwordResetExpires').gt(Date.now())

            if (user) {
                return res.render('reset_password', { email_address, random });
            } else {
                req.flash('error_msg', `Authentication failed!!!`);
                return res.redirect('/web');
            }
        } catch (error) {
            req.flash('error_msg', 'Internal server error');
            return res.redirect('/web');
        }
    }
}

exports.postResetPassword = async (req, res) => {
    try {
        const { email, random, password, confirm_password } = req.body;
        let myURL = (req.headers.referer).split('/')[3];
        let response = await account.resetPassword(email, random, password, confirm_password, myURL);

        req.flash('success_msg', response.msg);
        return res.redirect('/web');
    } catch (error) {
        if (error.errors) {
            req.flash('errors', error.errors);
            return res.redirect('/web');
        }
        else if (error.error) {
            req.flash('error_msg', error.error);
            return res.redirect('/web');
        }
        else {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/web');
        }
    }
}

/**
 * GET /web/account/my-profile
 * User profile.
 */
exports.getProfile = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('account/my-profile', {
            username: req.user.username,
            email: req.user.email,
            primechain_address: req.user.primechain_address
        });
    }
    return res.redirect('/web');
};

/**
 * GET /web/account/activity-logs
 * User Activity logs.
 */
exports.getActivityLogs = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let activityLogArr = [];
            const response = await account.getActivityLogs(req.user.email);

            response.msg.forEach(log => {
                activityLogArr.push({
                    ip: log.ip,
                    browser: log.browser,
                    timestamp: log.timestamp
                });
            });

            return res.render('account/activity_logs',
                {
                    activityLogArr,
                    username: req.user.username,
                    email: req.user.email,
                });

        } catch (error) {
            return res.render('account/activity_logs');
        }
    }
    res.redirect('/web');
};

/**
 * GET /web/account/change-password
 * User Change password.
 */
exports.getChangePassword = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('account/change_password', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
};

/**
 * POST /web/account/change-password
 * User Change password.
 */
exports.postChangePassword = async (req, res) => {
    try {
        const myURL = (req.headers.referer).split('/')[3];
        const { old_password, password, confirm_password } = req.body;

        await account.changePassword(req.user.email, old_password, password, confirm_password, myURL);

        req.flash("success_msg", "Your password changed successfully!!!");
        return res.redirect('/web/account/change-password');

    } catch (error) {
        if (error.errors) {
            req.flash('errors', error.errors);
            return res.redirect('/web/account/change-password');
        }
        else if (error.error) {
            req.flash('error_msg', error.error);
            return res.redirect('/web/account/change-password');
        }
        else {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/web/account/change-password');
        }
    }
};


/**
 * GET  /web/account/logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) console.log('Error : Failed to destroy the session during logout.', err);
        req.user = null;
        res.redirect('/web');
    });
};

exports.getBlockchainParameters = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await administration.blockchainParameters();

            return res.render('administration/blockchain_parameters', {
                blockchain_parameters: response.msg,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.redirect('/web');
        }
    }
    return res.redirect('/web');
}

exports.getRuntimeParameters = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await administration.runtimeParameters();

        return res.render('administration/runtime_parameters', {
            runtime_parameters: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

exports.getBlockchainInformation = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await administration.blockchainInformation();

        return res.render('administration/blockchain_information', {
            blockchain_information: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

// User management

exports.getUsersList = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const users_list = [];
            const users = await User.find();

            users.forEach(user => {
                users_list.push({
                    name: user.username,
                    email: user.email,
                    primechain_address: user.primechain_address
                });
            });

            return res.render('user-management/list', {
                users_list,
                username: req.user.username,
                email: req.user.email,
            })
        } catch (error) {
            return res.render('user-management/list', {
                username: req.user.username,
                email: req.user.email,
            });
        }
    }
    return res.redirect('/web')
}

// Permissions

// List permissions
exports.getListPermissions = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await permissions.listPermissions(req.user.primechain_address);

        return res.render('permissions/list_permissions', {
            list_permissions: response.msg.primechain_address,
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
};

// Manage permissions
exports.getManagePermissions = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let user_permissions = {};

        const list_permissions = await permissions.listPermissions(req.user.primechain_address);

        list_permissions.msg.primechain_address.forEach(permission => {
            user_permissions[[permission.type]] = true;
        });

        return res.render('permissions/manage_permissions', {
            list_permissions: user_permissions,
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
};

exports.postManagePermissions = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { action, permission } = req.body;

            let response = await permissions.managePermissions(action, req.user.primechain_address, permission);

            if (response.msg.status === 200) {
                return res.json({
                    success: true
                })
            }
            else {
                return res.json({
                    success: false,
                    message: response.msg.message
                });
            }
        } catch (error) {
            return res.json({
                success: false,
                message: "Internal server error!!!"
            });
        }
    }
    res.redirect('/web');
};

// Electronic signatures
exports.getCreateSignature = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('esignature/create_signature', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

exports.postCreateSignature = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const myURL = (req.headers.referer).split('/')[5];
            const { data } = req.body;

            const response = await esignature.createSignature(req.user.primechain_address, data, myURL);

            if (!response.msg.tx_id) {
                return res.json({
                    success: true,
                    signature: response.msg.signature
                });
            }
            else {
                return res.json({
                    success: true,
                    signature: response.msg.signature,
                    txid: response.msg.tx_id
                });
            }
        } catch (error) {
            return res.json({
                success: false,
                message: error.error
            });
        }
    }
    res.redirect('/web');
};

exports.getVerifySignature = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('esignature/verify_signature', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
};

exports.postVerifySignature = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { data, signature } = req.body;
            const response = await esignature.verifySignature(req.user.primechain_address, data, signature);

            return res.json({
                success: true,
                signature: response.msg
            });
        } catch (error) {
            return res.json({
                success: false
            });
        }
    }
    res.redirect('/web');
};

// Electronic signatures
exports.getCreateSaveSignature = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('esignature/create_save_signature', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

// Data streams
exports.getCreateDataStream = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dataStreams/create', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

exports.postCreateDataStream = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { trade_channel_name, details, open } = req.body;

            let response = await dataStreams.create(req.user.primechain_address, trade_channel_name, details, open);

            return res.json({
                success: true,
                transaction_id: response.msg,
                trade_channel_name
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
}

exports.getGrantWritePermission = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dataStreams/grant', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
}

exports.postGrantWritePermission = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { trade_channel_writer, trade_channel_name } = req.body;

            let response = await dataStreams.grant(trade_channel_writer, trade_channel_name, req.user.primechain_address);

            return res.render('dataStreams/view', {
                transaction_id: response.msg,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            req.flash('error_msg', "Internal server error!!!");
            res.redirect('/web/data-streams/grant');
        }
    }
    return res.redirect('/web');
}

exports.getRevokeWritePermission = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dataStreams/revoke', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

exports.postRevokeWritePermission = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { trade_channel_writer, trade_channel_name } = req.body;

            let response = await dataStreams.grant(trade_channel_writer, trade_channel_name, req.user.primechain_address);

            return res.json({
                success: true,
                transaction_id: response.msg
            });
        } catch (error) {
            req.flash('error_msg', "Internal server error!!!");
            res.redirect('/web/data-streams/grant');
        }
    }
    res.redirect('/web');
}

exports.getAllDataStreams = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let streamArr = [];
            let response = await dataStreams.read();

            response.msg.forEach(stream => {
                streamArr.push({
                    name: stream.name,
                    open: (stream.restrict.write) ? "false" : "true"
                });
            });

            return res.render('dataStreams/view', {
                streamArr,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('dataStreams/view');
        }
    }
    res.redirect('/web');
}

exports.getCreateAsset = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('sam/create', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
};

exports.postCreateAsset = async (req, res) => {
    try {
        const { name, quantity, open, unit, description } = req.body;

        let response = await sam.create(req.user.primechain_address, req.user.primechain_address, name, quantity, unit, open, description);

        if (response.status === 200) {
            return res.json({
                success: true,
                asset_name: response.msg.name,
                asset_quantity: response.msg.quantity,
                asset_open: open,
                asset_unit: response.msg.unit,
                asset_description: response.msg.description,
                asset_ref: response.msg.asset_ref,
                txid: response.msg.txid
            });
        }
        else {
            return res.json({
                "success": false,
                "message": response.message
            });
        }
    } catch (error) {
        return res.json({
            "success": false,
            "message": error
        });
    }
};

exports.getViewMyAssets = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await sam.listAssets(req.user.primechain_address);

        return res.render('sam/view', {
            assets: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

exports.getTransferAsset = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        let response = await sam.listAssets(req.user.primechain_address);

        return res.render('sam/transfer', {
            assets: response.msg,
            username: req.user.username,
            email: req.user.email,
        });
    }
    res.redirect('/web');
}

exports.getSendAsset = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('sam/send',
            {
                asset_name: req.params.name,
                username: req.user.username,
                email: req.user.email,
            });
    }
    return res.redirect('/web');
}

exports.postSend = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { receiver_address, asset_name, quantity, description } = req.body;

            let response = await sam.send(req.user.primechain_address, receiver_address, asset_name, quantity, description);

            if (response.status === 200) {
                req.flash('success_msg', "Asset successfully sent!!" + response.msg)
                return res.redirect('/web/sam/transfer')
            }
        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/web/sam/transfer');
            }
            else if (error.error) {
                req.flash('error_msg', error.error);
                return res.redirect('/web/sam/transfer');
            }
            else {
                req.flash('error_msg', "Internal server error!!!");
                return res.redirect('/web/sam/transfer');
            }
        }
    }
    return res.redirect('/web')
}

exports.getPublishPlainData = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dave/upload_plain_data', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
};

exports.postPublishPlainData = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { key, data, stream_name } = req.body;

            let response = await dave.publishPlainData(req.user.primechain_address, data, stream_name, key);

            return res.json({
                success: true,
                transaction_id: response.msg,
                key,
                stream_name
            });

        } catch (error) {
            return res.json({
                success: false
            });
        }
    }
    res.redirect('/web');
}

exports.getDownloadPlainData = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dave/download_plain_data', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
}

exports.postDownloadPlainData = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let data = [];
            const { key, stream_name } = req.body;

            let responseArr = await dave.downloadPlainData(key, stream_name);

            responseArr.msg.forEach(response => {
                data.push({
                    [response.key]: response.data
                });
            });

            return res.render('dave/view_plain_data', {
                dataArr: data,
                username: req.user.username,
                email: req.user.email,
            });

        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/web');
            }
            else if (error.error) {
                req.flash('error_msg', error.error);
                return res.redirect('/web');
            }
            else {
                req.flash('error_msg', "Internal server error!!!");
                return res.redirect('/web');
            }
        }
    }
    return res.redirect('/web');
}

exports.getPublishEncryptedData = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dave/encrypted_data', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web')
}

exports.postPublishEncryptedData = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { data, stream_name } = req.body;

            let response = await dave.publishEncryptedData(req.user.primechain_address, data, stream_name);

            return res.json({
                success: true,
                tx_id_enc_data: response.msg.tx_id_enc_data,
                tx_id_signature: response.msg.tx_id_signature,
                signature: response.msg.signature,
                password: response.msg.aes_password,
                iv: response.msg.aes_iv
            })
        } catch (error) {
            res.json({ success: false });
        }
    }
}

exports.getDownloadDecryptData = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dave/download_decrypt_data', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
}

exports.postDownloadDecryptData = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { txid_data, txid_signature, password, iv, stream_name } = req.body;

            let response = await dave.downloadDecryptedData(txid_data, txid_signature, password, iv, stream_name);

            return res.render('dave/view_decrypted_data', {
                data: response.msg.data,
                signerDetails: response.msg.signer_detail.primechain_address,
                signature: response.msg.signature_status,
                username: req.user.username,
                email: req.user.email,
            });
        } catch (error) {
            return res.render('dave/view_decrypted_data', {
                error_msg: "Internal server error"
            });
        }
    }
}

exports.getFilePublish = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dave/file/publish', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
}

exports.postFilePublish = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { stream_name } = req.body;
            const file = req.files['file[0]'];

            let response = await dave.encryptFile(req.user.primechain_address, file, stream_name);

            if (response.msg === undefined) {
                return res.json({
                    success: false
                });
            }
            else {
                return res.json({
                    success: true,
                    tx_id_enc_file: response.msg.tx_id_enc_file,
                    tx_id_signature: response.msg.tx_id_signature,
                    signature: response.msg.signature,
                    aes_password: response.msg.aes_password,
                    aes_iv: response.msg.aes_iv,
                    stream_name
                });
            }

        } catch (error) {
            return res.json({
                success: false
            });
        }
    }
}

exports.getFileDownload = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('dave/file/download', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
}

exports.postFileDownload = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { txid_data, txid_signature, password, iv, stream_name } = req.body;

            let response = await dave.downloadFile(txid_data, txid_signature, password, iv, stream_name);

            let data = Buffer.from(response.msg.data, 'hex').toString();

            res.writeHead(200, {
                'Content-Type': response.msg.mimetype,
                'Content-disposition': 'attachment;filename=' + response.msg.name,
                'Content-Length': data.length
            });

            res.end(data);
        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/web/dave/file/view');
            }
            else if (error.error) {
                req.flash('error_msg', error.error);
                return res.redirect('/web/dave/file/view');
            }
            else {
                req.flash('error_msg', "Internal server error!!!");
                return res.redirect('/web/dave/file/view');
            }
        }
    }
}

exports.getFormWizard = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('wizard/create', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
}

exports.postFormWizard = async (req, res) => {
    try {
        if (req.user && req.isAuthenticated()) {
            let response = await create(req.body);

            req.flash("success_msg", "Data instered and id", response.msg['_id']);
            return res.redirect('/web/element/form-wizards/create')
        }
    } catch (error) {
        req.flash('error_msg', "Internal server error!!!");
        return res.redirect('/web/element/form-wizards/create');
    }

}

exports.getListFormWizard = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let wizard_data = [];
>>>>>>> master

const { issue, retrieve, share } = require('../../../functions/plugins/bankGuarantee');







// Permissions












<<<<<<< HEAD

=======
                req.flash("success_msg", "Document link e-mail sent successfully!!!")
                return res.redirect('/web/plugins/bank-guarantee/view');
            }
            else {
                req.flash("error_msg", "Missing inputs");
                return res.redirect('/web/plugins/bank-guarantee/view');
            }
        } catch (error) {
            req.flash("error_msg", "Internal server error");
            return res.redirect('/web/plugins/bank-guarantee/view');
        }
    }
    return res.redirect('/web')
}
>>>>>>> master


exports.getRetrieveBG = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('plugins/bank-guarantee/retrieve', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/web');
}



exports.postRetrieveBG = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let response = await retrieve(req.body);
            let modifiedData = response.msg['data'];

            modifiedData['primechain_address'] = req.user.primechain_address;
            modifiedData['signature_status'] = modifiedData['signature_status'];
            modifiedData['timestamp'] = modifiedData['timestamp'];

            return res.json({
                success: true,
                data: modifiedData
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            })
        }
    }
    return res.redirect('/web');
}











