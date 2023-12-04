const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: Boolean(process.env.SECURE),
      auth: {
        user: "usahaoptima2@gmail.com",
        pass: "httrmsccbcfaowfc",
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
