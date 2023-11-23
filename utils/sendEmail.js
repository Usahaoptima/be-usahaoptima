const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: Boolean(process.env.SECURE),
      secureConnection: Boolean(process.env.SECURE_CONNECTION),
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: process.env.REJECT,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};
