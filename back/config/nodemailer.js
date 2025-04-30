import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter once and reuse
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Email templates
const emailTemplates = {
  resetPassword: (resetCode) => ({
    subject: 'Password Reset Code',
    html: `
      <div style="font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Your password reset code is: <strong>${resetCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  }),
  
  orderConfirmation: (orderDetails) => ({
    subject: 'Order Confirmation',
    html: `
      <div style="font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p>Order ID: ${orderDetails.orderId}</p>
        <p>Total: $${orderDetails.total}</p>
      </div>
    `
  }),

  welcome: (username) => ({
    subject: 'Welcome to Our Store',
    html: `
      <div style="font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Welcome ${username}!</h2>
        <p>Thank you for joining our store.</p>
      </div>
    `
  })
};

// Main send email function
export async function sendEmail(to, templateName, data) {
  try {
    const template = emailTemplates[templateName](data);
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
}

// Usage examples:
/*
// Send password reset email
await sendEmail(
  user.email, 
  'resetPassword',
  '123456'
);

// Send order confirmation
await sendEmail(
  customer.email,
  'orderConfirmation',
  {
    orderId: 'ORD123',
    total: 99.99
  }
);

// Send welcome email
await sendEmail(
  newUser.email,
  'welcome',
  newUser.name
);
*/

export default sendEmail;