const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailService = {
  sendNotificationEmail: async (to, content) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Νέα ειδοποίηση από το Wellness App',
      text: content
    };

    await transporter.sendMail(mailOptions);
  }
};

module.exports = emailService;
