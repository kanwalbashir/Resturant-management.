const nodemailer = require("nodemailer");

// Replace with your Gmail and the generated App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dua47214@gmail.com",
    pass: "pigy vvgl tccv dikv", 
  },
});
async function sendEmail(to, subject, text) {
  try {
    let info = await transporter.sendMail({
      from: '"Taste Haven" <dua47214@gmail.com>',
      to,
      subject,
      text,  
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
     throw err; 
  }
}
module.exports = sendEmail;