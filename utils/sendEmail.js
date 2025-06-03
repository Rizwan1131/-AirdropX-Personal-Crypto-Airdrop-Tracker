import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to,
    subject,
    html: `<p>${text}</p>`
  });
};

export default sendEmail;
