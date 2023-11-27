import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const codeSender = async (email: string, code: number) => {
  return await transporter.sendMail({
    from: 'juratbekxudayberganov9@gmail.com',
    to: email,
    subject: 'Email confirmation',
    html: `<span>Tasdiqlash kodi: <b>${code}</b></span>`,
  });
};
