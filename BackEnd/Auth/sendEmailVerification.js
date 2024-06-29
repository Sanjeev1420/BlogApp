const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmailVerification(email, verificationCode) {
  try {
    // Create a nodemailer transporter using your email provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.MAIL,
      to: email,
      subject: "Welcome to MindVerse: Unlock Your Mind's Potential",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #008080; text-align: center;">Welcome to MindVerse</h1>
          <p style="text-align: center;">Thank you for joining MindVerse, where your ideas come to life!</p>
          <hr style="border: none; border-top: 2px solid #008080;">
          <p style="text-align: center;">To embark on a journey of self-discovery and creativity, please enter the following verification code:</p>
          <div style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
            <h2 style="color: #008080; margin: 0;">${verificationCode}</h2>
          </div>
          <!-- Please do not reply to this email. This email is for informational purposes only. -->
        </div>
      `,
    });

  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmailVerification;
