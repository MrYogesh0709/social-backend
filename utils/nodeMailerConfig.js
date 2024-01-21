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
export const invoiceTemplateForForgotPassword = ({
  user,
  expirationTime,
  resetURL,
}) => {
  const minutes = Math.ceil(expirationTime / (1000 * 60));
  const time = minutes > 1 ? `${minutes} minutes` : "1 minute";

  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
      }
  
      .header {
        background-color: #f4f4f4;
        padding: 20px;
        text-align: center;
      }
  
      .content {
        padding: 20px;
      }
  
      .footer {
        background-color: #f4f4f4;
        padding: 10px;
        text-align: center;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset</h1>
      </div>
      <div class="content">
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. If you did not make this request, you can ignore this email.
        </p>
        <p>To reset your password, click on the following link:</p>
        <p><a href="${resetURL}">Reset Password</a></p>
        <p>This link will expire in ${time} If you need assistance, please contact our support team.</p>
      </div>
      <div class="footer">
        <p>This email was sent from Social. If you have any questions or need assistance, please
          <a href="mailto:rohitvanzara01@gmail.com">contact our support team</a>.</p>
      </div>
    </div>
  </body>
  
  </html>
  `;
};
export const invoiceTemplateForResetPassWord = (user) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Change Confirmation</title>
      <style>
        body {
          font-family: "Arial", sans-serif;
          line-height: 1.6;
          color: #333;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
        }
  
        .header {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
        }
  
        .content {
          padding: 20px;
        }
  
        .footer {
          background-color: #f4f4f4;
          padding: 10px;
          text-align: center;
        }
      </style>
    </head>
  
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Change Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello ${user.name}</p>
          <p>
            Your password for Social  has been changed successfully. If you did
            not initiate this change, please contact our support team immediately.
          </p>
          <p>Thank you for using Social !</p>
        </div>
        <div class="footer">
          <p>
            This email was sent from Social . If you have any questions or need
            assistance, please
            <a href="mailto:rohtivanzara01@gmail.com">contact our support team</a>.
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
};
