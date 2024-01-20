import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const transporterMail = {
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD,
  },
};

export const sendMail = ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport(transporterMail);
  return transporter.sendMail({
    from: "'Social'  <yogeshvanzara98@gmail.com>", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
};
