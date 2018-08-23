module.exports = function (recMail, recId) {

    const nodemailer = require('nodemailer');
    const keys = require('./keys');

    let url = 'http://127.0.0.1:3000/user/' + recId + '/emailverify';
        url = 'https://de28128f.ngrok.io//user/' + recId + '/emailverify';

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
             service: 'gmail',
             secure: false, // use SSL
             port: 25, // port for secure SMTP
             auth: {
                    user: keys.botmail.emailID,
                    pass: keys.botmail.emailSecret
                },
            tls: { rejectUnauthorized: false }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: keys.botmail.emailID, // sender address
            to: recMail, // list of receivers
            subject: 'Verify your account✔', // Subject line
            text: 'Login and Click the link to verify your account!', // plain text body
            html: '<p>Hello Please LOGIN and CLICK the link to verify your account</p><br><a href=' + url + '>Verify your account!</a>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
};