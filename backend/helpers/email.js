// for nodemail since sendgrid sucks
const nodeMailer = require("nodemailer");

exports.sendEmailWithNodemailer = (req, res, emailData) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: `${process.env.GMAIL_APP_EMAIL}`,   // gmail
            pass: `${process.env.GMAIL_APP_PASS}`,   // app-specific password for gmail
        },
        tls: {
            ciphers: "SSLv3",
        },
    });

    return transporter.sendMail(emailData)
    .then((info) => {
        console.log(`Message sent: ${info.response}`);
        // return res.json({
        //     success: true,
        // }) //gives error of unhandled 
    }).catch((err) => console.log(`Problem sending email: ${err}`));

}