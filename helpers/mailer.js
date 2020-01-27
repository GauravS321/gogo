class MailNotificationEngine {
    constructor(productName) {
        this.baseUrl = `http://${process.env.APPLICATION_HOSTNAME}:${process.env.APPLICATION_PORT}`;
        this.productName = productName;
        this.nodemailer = require('nodemailer');
        this.transporter = this.nodemailer.createTransport({
            service: process.env.MAIL_SERVICE_NAME,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        this.sgEmptyRequest = {
            from: '',
            to: [],
            subject: '',
            html: ''
        };

        this.emailTop = `<html>
                            <body style="background-color: #222533; padding: 20px; font-size: 14px; line-height: 1.43; font-family:Helvetica Neue Segoe UI, Helvetica, Arial, sans-serif;">
                                <div style="max-width: 600px; margin: 0px auto; background-color: #fff; box-shadow: 0px 20px 50px rgba(0,0,0,0.05);">
                                    <table style="width: 100%;">
                                        <tr>
                                            <td style="background-color: #fff;">
                                                <img alt="" src="https://www.primechaintech.com/images/logo-2.png" style="width: 208px; padding: 20px">
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="padding: 20px 70px; border-top: 1px solid rgba(0,0,0,0.05);">`;

        this.emailBottom = `        Have an amazing day!<br>Team Primechain<br/><br/>

                                    This email contains a secure link to ${this.productName}. Please do not share this email, link, or access code with unauthorised persons.
                                        
                                    </div>
                                    <div style="background-color: #F5F5F5; padding: 0px; text-align: center;">
                                        <div style="padding-top: 5px; padding-bottom: 5px; border-top: 1px solid rgba(0,0,0,0.05);">
                                        
                                            <div style="color: #A5A5A5; font-size: 10px;">Copyright © 2016-20 Primechain Technologies Pvt. Ltd. All Rights Reserved.</div>
                                        </div>
                                    </div>
                                </div>
                            </body>
                        </html>`;
    }

    /*******************************************************************************************************************
    Send email notification
    *******************************************************************************************************************/
    sendEmailNotification(fromAddress, toList, subject, body, ccList, bccList) {
        return new Promise(async (resolve, reject) => {
            try {
                let toEmail = toList;

                // if (toList && toList.length) {
                //     for (let i = 0, j = toList.length; i < j; i++) {
                //         if (toList[i].trim() !== '')
                //             toEmail[toList[i].trim()]
                //     }
                // }

                // if (!toEmail && !toEmail.length)
                //     throw Error('To email cannot be empty');


                let sgRequestedData = this.sgEmptyRequest;
                sgRequestedData.to = toEmail;
                sgRequestedData.subject = subject.trim();
                sgRequestedData.from = fromAddress;
                sgRequestedData.html = this.emailTop + body.trim() + this.emailBottom;

                if (ccList && ccList.length) {
                    let ccEmail = [];
                    for (let i = 0, j = ccList.length; i < j; i++) {
                        if (ccList[i].trim() !== '')
                            ccEmail.push({
                                email: ccList[i].trim()
                            });
                    }

                    if (bccList && bccList.length) {
                        let bccEmail = [];
                        for (let i = 0, j = bccList.length; i < j; i++) {
                            if (bccList[i].trim() !== '')
                                bccEmail.push({
                                    email: bccList[i].trim()
                                });
                        }

                        if (bccEmail && bccEmail.length)
                            sgRequestedData['bcc'] = bccEmail;
                    }
                }

                await this.transporter.sendMail(sgRequestedData)
                return resolve({
                    status: 200,
                    sent: true
                });
            } catch (error) {
                return reject({
                    status: 500,
                    message: "Unable to sent e-mail"
                });
            }
        });

    }


    /*******************************************************************************************************************
    Send account activation email 
    *******************************************************************************************************************/
    sendAccountActivationEmail(email, username, designation, organization, random) {
        return new Promise((resolve, reject) => {
            let activateUserUrl = `${this.baseUrl}/account-activation?email_address=${email}&random=${random}`;
            let subject = `Account Activation <> ${username}`;
            let fromAddress = {
                name: `${this.productName}`,
                email: 'info@primechain.in'
            };

            let emailBody = `<p>Hi ${username}!
                                <br>
                                <br>
                                Welcome to ${this.productName}. Your details are:
                            </p>

                            <table rules='all' style='border-color: #dfd9c2;' cellpadding=10>
                                <tr>
                                    <td>Name:</td>
                                    <td>${username}</td>
                                </tr>
                                <tr>
                                    <td>Designation:</td>
                                    <td>${designation}</td>
                                </tr>
                                <tr>
                                    <td>Organization:</td>
                                    <td>${organization}</td>
                                </tr>
                            </table>

                            <p>If the details are correct, click the 'Activate account' button below and your login credentials will be
                                emailed to you.
                            </p>

                            <a href='${activateUserUrl}' style='padding: 8px 20px; background-color: #4B72FA; color: #fff; font-weight: bolder; font-size: 16px; display: inline-block; margin: 20px 0px; margin-right: 20px; text-decoration: none;'>Activate Account
                            </a>

                            <p>If you are unable to click the button above, copy paste this link in your browser and press Enter:
                                ${activateUserUrl}
                            </p>`;

            this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)
                .then((emailSent) => {
                    resolve((emailSent) ? true : false);
                })
                .catch(err => reject(err));
        });
    };

    /*******************************************************************************************************************
    Send login credentials
    *******************************************************************************************************************/
    sendLoginCredentials(email, username, password) {
        return new Promise((resolve, reject) => {
            let subject = `Login Credentials <> ${username}`;
            let fromAddress = {
                name: `${this.productName}`,
                email: 'info@primechain.in'
            };

            let emailBody = `<p>Hi ${username}!
                                <br>
                                <br> 
                                This is what you need to login to ${this.productName}:
                            </p>

                            <table rules='all' style='border-color: #dfd9c2;' cellpadding=10>
                                <tr>
                                    <td>Email address: </td>
                                    <td>${email}</td>
                                </tr>
                                <tr>
                                    <td>Password: </td>
                                    <td>${password}</td>
                                </tr>
                                <tr>
                                    <td>Login at :</td>
                                    <td>
                                        <a href='${this.baseUrl}'>${this.baseUrl}</a>
                                    </td>
                                </tr>
                            </table>`;

            this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)
                .then(emailSent => {
                    if (emailSent)
                        resolve(true);
                    else
                        resolve(false);
                })
                .catch(err => reject(err));
        });
    }


    /*******************************************************************************************************************
    Send sign-in attempt failed
    *******************************************************************************************************************/
    signInAttemptFailed(email) {
        return new Promise((resolve, reject) => {
            let subject = `Unauthorized Sign-in Attempt`;
            let fromAddress = {
                name: `${this.productName}`,
                email: 'info@primechain.in'
            };

            let emailBody = ` <img alt="" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwm00KpSezs3zCdjq_nqIUI6o5kS2K1CLYJPoSfmFBuq87C5-" style="width: 64px; margin-left:40%">
           
            <h3 style="text-align:center">Sign-in attempt was blocked</h3>

           <br>
           <br>
           <hr>
           <p>Someone just used your password to try to sign-in to your account. Primechain blocked them, but you should check what happened.</p>
               <br>`;

            this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)
                .then(emailSent => {
                    if (emailSent)
                        resolve(true);
                    else
                        resolve(false);
                })
                .catch(err => reject(err));
        });
    }

    /*******************************************************************************************************************
    Send email notification of the login
    *******************************************************************************************************************/
    sendLoginNotification(username, email, ip, browser, timestamp) {
        return new Promise((resolve, reject) => {
            let subject = `Login from <> ${ip}`;
            let fromAddress = {
                name: `${this.productName}`,
                email: 'info@primechain.in'
            };

            let emailBody = `<p>Hello ${username}!
                                <br>
                                <br>
                                There has been a successful login into your ${this.productName} account. The details are:
                            </p>

                            <table rules='all' style='border-color: #dfd9c2;' cellpadding=10>
                                <tr>
                                    <td>Email address:</td>
                                    <td>${email}</td>
                                </tr>
                                <tr>
                                    <td>IP address:</td>
                                    <td>${ip}</td>
                                </tr>
                                <tr>
                                    <td>Browser:</td>
                                    <td>${browser}</td>
                                </tr>
                                <tr>
                                    <td>Timestamp:</td>
                                    <td>${timestamp}</td>
                                </tr>
                            </table>
                        
                            <p>If you have initiated this login, you can safely ignore this email. 
                                <br>
                                <br>
                                <strong>If you have not initiated this login, someone has just accessed your account without authorization. Please take appropriate action immediately.</strong>
                            </p>`;

            this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)
                .then(emailSent => {
                    if (emailSent)
                        resolve(true);
                    else
                        resolve(false);
                })
                .catch(err => reject(err));
        });
    }

    /*******************************************************************************************************************
    Send two step authentication code by email 
    *******************************************************************************************************************/
    sendAuthenticationCodeByEmail(email, username, authenticationCode) {
        return new Promise((resolve, reject) => {
            let subject = 'Authentication code for login';
            let fromAddress = {
                name: `${this.productName}`,
                email: 'info@primechain.in'
            };
            let emailBody = `<p> Hello ${username}!
                                <br>
                                <br>
                                Your authentication code for login in ${this.productName}: 
                                <b>${authenticationCode}</b>
                             </p>`;

            this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)
                .then(emailSent => {
                    if (emailSent)
                        resolve(true);
                    else
                        resolve(false);
                })
                .catch(err => reject(err));
        });
    }
    /*******************************************************************************************************************
    Send two step authentication code by email 
    *******************************************************************************************************************/
    sendOtpByEmail(email, username, authenticationCode) {
        return new Promise((resolve, reject) => {
            let subject = 'OTP for signing';
            let fromAddress = {
                name: `${this.productName}`,
                email: 'info@primechain.in'
            };
            let emailBody = `<p> Hello ${username}!
                            <br>
                            <br>
                            Your OTP code to sign the NDA: 
                            <b>${authenticationCode}</b>
                         </p>`;

            this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)
                .then(emailSent => {
                    if (emailSent)
                        resolve(true);
                    else
                        resolve(false);
                })
                .catch(err => reject(err));
        });
    }

    /*******************************************************************************************************************
    Send password reset email
    *******************************************************************************************************************/
    sendPasswordResetEmail(email, username, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let subject = 'Password reset instructions';
                let fromAddress = {
                    name: `${this.productName}`,
                    email: 'info@primechain.in'
                };

                let emailBody = `<p>Hello ${username}!
                                <br>
                                <br>
                                A password reset has been initiated for your ${this.productName} account. To reset your password, <a href='${this.baseUrl}/${url}/reset-password?email_address=${email}&random=${token}'>click here</a>
                                <br>
                            </p>

                            <p>If you are unable to click the link above, copy the below link and paste it in your browser and press Enter:
                            <br>
                            ${this.baseUrl}/reset-password?email_address=${email}&random=${token}
                            </p>

                            <p>
                            <strong style="color:red;">Note: The above link will get expired in one hour.</strong>
                            </p>

                             <p>
                                 <strong>If you have not initiated this request, simply delete this email.</strong>
                            </p>`

                await this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)

                resolve({
                    status: 200,
                    message: true
                });

            } catch (error) {
                reject({
                    status: 500,
                    message: error
                });
            }
        });
    }

    /*******************************************************************************************************************
    Send password changed notification
    *******************************************************************************************************************/
    sendPasswordChangedNotification(email, username) {
        return new Promise(async (resolve, reject) => {
            try {
                let subject = `Your ${this.productName} password has changed`;
                let fromAddress = {
                    name: `${this.productName}`,
                    email: 'info@primechain.in'
                };

                let emailBody = `Hello ${username}!
                            <br>

                            <p style='color: #448eef; font-size: 40px;'>
                                Your password changed
                            </p>

                            <p>
                            The password for the ${this.productName} account ${email} was just changed.
                            </p>

                            <p>
                                <strong>If this was you, then you can safely ignore this email.</strong>
                            </p>

                            <p> 
                            If this wasn't you, your account has been compromised. Please reset your password.
                            <br>
                             You can reset your password by clicking the following  button 
                            </p>
                            
                            <a href='${this.baseUrl}/lost-password' style='padding: 8px 20px; background-color: #4B72FA; color: #fff; font-weight: bolder; font-size: 16px; display: inline-block; margin: 20px 0px; margin-right: 20px; text-decoration: none;'>Reset password
                            </a>
                            <br>`;

                await this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null);

                return resolve({
                    status: 200,
                    message: true
                });
            } catch (error) {
                return reject({
                    status: 500,
                    message: error
                });
            }
        });
    }

    /*******************************************************************************************************************
    Send password changed notification
    *******************************************************************************************************************/
    shareVerificationMail(sender_email, receiver_name, email, use_case, path) {
        return new Promise((resolve, reject) => {
            let subject = `Blockchain protected document`;
            let fromAddress = `${sender_email}`;

            let emailBody = `<p><strong>
                                Hello ${receiver_name}!
                            </strong></p>
                            <p>A blockchain-protected document has been shared with you.</p>

                        <a href='${this.baseUrl}/plugins/dave/${use_case}/verification?${path}' style='padding: 8px 20px; background-color: #4B72FA; color: #fff; font-weight: bolder; font-size: 16px; display: inline-block; margin: 20px 0px; margin-right: 20px; text-decoration: none;'>View document
                        </a>
                        <br>
                        
                        <a href='${this.baseUrl}/plugins/dave/${use_case}/qrcode?text=${this.baseUrl}/plugins/dave/${use_case}/verification?${path} style='padding: 8px 20px; background-color: #4B72FA; color: #fff; font-weight: bolder; font-size: 16px; display: inline-block; margin: 20px 0px; margin-right: 20px; text-decoration: none;'>View QRcode
                        </a>
                        <br>
                        <br>`;

            this.sendEmailNotification(fromAddress, [email], subject, emailBody, null, null)
                .then(emailSent => {
                    if (emailSent)
                        resolve(true);
                    else
                        resolve(false);
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = new MailNotificationEngine(process.env.APPLICATION_NAME);
