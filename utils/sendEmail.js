const nodemailer = require("nodemailer");
const config = require('../config/global');

const sendEmail = async (email, subject, text) => {
    console.log(email);
    try {
        const transporter = nodemailer.createTransport({
            // service: config.service,
            // host: 'smtp.outlook.com',
            service: config.service,
            auth: {
                user: config.userMail,
                pass: config.password,
            },
        });

        console.log("here: " + subject);

        await transporter.sendMail({
            from: config.userMail,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;