const nodemailer = require("nodemailer");

async function EmailSendToUser(user_email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user_email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Hello from <b>UNIATOR</b></p>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("Email sent successfully to:", user_email);
    console.log("Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

module.exports = EmailSendToUser;
